import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

interface SignalingMessage {
  type: 'join' | 'leave' | 'offer' | 'answer' | 'ice-candidate' | 'user-joined' | 'user-left';
  roomId: string;
  userId: string;
  data?: any;
  targetUserId?: string;
}

interface Room {
  id: string;
  participants: Map<string, WebSocket>;
  createdAt: Date;
}

// Store rooms in memory (in production, use Redis or similar)
const rooms = new Map<string, Room>();

serve(async (req) => {
  console.log('Video call signaling request received');
  
  const { headers } = req;
  const upgradeHeader = headers.get("upgrade") || "";

  if (upgradeHeader.toLowerCase() !== "websocket") {
    return new Response("Expected WebSocket connection", { status: 400 });
  }

  const { socket, response } = Deno.upgradeWebSocket(req);
  let currentRoom: string | null = null;
  let currentUserId: string | null = null;

  socket.onopen = () => {
    console.log('WebSocket connection opened');
  };

  socket.onmessage = (event) => {
    try {
      const message: SignalingMessage = JSON.parse(event.data);
      console.log('Received message:', message.type, 'from user:', message.userId, 'in room:', message.roomId);

      switch (message.type) {
        case 'join':
          handleJoinRoom(socket, message);
          currentRoom = message.roomId;
          currentUserId = message.userId;
          break;

        case 'leave':
          handleLeaveRoom(socket, message);
          break;

        case 'offer':
        case 'answer':
        case 'ice-candidate':
          handleWebRTCMessage(socket, message);
          break;

        default:
          console.log('Unknown message type:', message.type);
      }
    } catch (error) {
      console.error('Error processing message:', error);
      socket.send(JSON.stringify({ 
        type: 'error', 
        message: 'Invalid message format' 
      }));
    }
  };

  socket.onclose = () => {
    console.log('WebSocket connection closed');
    if (currentRoom && currentUserId) {
      handleLeaveRoom(socket, {
        type: 'leave',
        roomId: currentRoom,
        userId: currentUserId
      });
    }
  };

  return response;
});

async function notifyCallRecipient(supabaseClient: any, message: SignalingMessage) {
  // In a real implementation, you would:
  // 1. Check if recipient is online
  // 2. Send push notification if offline
  // 3. Store call invitation in database
  
  console.log(`Notifying ${message.toUserId} of incoming call from ${message.fromUserId}`);
  
  // Use Supabase realtime to notify the recipient
  const channel = supabaseClient.channel(`call_${message.callId}`);
  channel.send({
    type: 'broadcast',
    event: 'incoming_call',
    payload: {
      callId: message.callId,
      fromUserId: message.fromUserId,
      timestamp: new Date().toISOString()
    }
  });
}

async function forwardSignalingMessage(supabaseClient: any, message: SignalingMessage) {
  console.log(`Forwarding ${message.type} from ${message.fromUserId} to ${message.toUserId}`);
  
  // Use Supabase realtime to forward the signaling message
  const channel = supabaseClient.channel(`call_${message.callId}`);
  channel.send({
    type: 'broadcast',
    event: 'signaling',
    payload: {
      type: message.type,
      fromUserId: message.fromUserId,
      toUserId: message.toUserId,
      payload: message.payload,
      timestamp: new Date().toISOString()
    }
  });
}

async function notifyCallEnded(supabaseClient: any, message: SignalingMessage) {
  console.log(`Call ${message.callId} ended by ${message.fromUserId}`);
  
  // Use Supabase realtime to notify call end
  const channel = supabaseClient.channel(`call_${message.callId}`);
  channel.send({
    type: 'broadcast',
    event: 'call_ended',
    payload: {
      callId: message.callId,
      endedBy: message.fromUserId,
      reason: message.payload?.reason || 'ended',
      timestamp: new Date().toISOString()
    }
  });
  
  // Clean up call record if stored in database
  // await supabaseClient.from('active_calls').delete().eq('call_id', message.callId);
}