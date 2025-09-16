import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SignalingMessage {
  type: 'offer' | 'answer' | 'ice-candidate' | 'call-ended' | 'call-started';
  callId: string;
  fromUserId: string;
  toUserId: string;
  payload?: any;
}

serve(async (req) => {
  const { headers } = req;
  const upgradeHeader = headers.get("upgrade") || "";

  if (upgradeHeader.toLowerCase() !== "websocket") {
    return new Response("Expected WebSocket connection", { status: 400 });
  }

  const { socket, response } = Deno.upgradeWebSocket(req);
  
  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );

  let userId: string | null = null;
  let activeCallId: string | null = null;

  socket.onopen = () => {
    console.log("WebSocket connection opened for video call signaling");
  };

  socket.onmessage = async (event) => {
    try {
      const message: SignalingMessage = JSON.parse(event.data);
      console.log('Received signaling message:', message.type, message.callId);

      // Store user ID from first message
      if (!userId) {
        userId = message.fromUserId;
        activeCallId = message.callId;
      }

      switch (message.type) {
        case 'call-started':
          // Notify the recipient about incoming call
          await notifyCallRecipient(supabaseClient, message);
          break;

        case 'offer':
          // Forward offer to recipient
          await forwardSignalingMessage(supabaseClient, message);
          break;

        case 'answer':
          // Forward answer to caller
          await forwardSignalingMessage(supabaseClient, message);
          break;

        case 'ice-candidate':
          // Forward ICE candidate to the other peer
          await forwardSignalingMessage(supabaseClient, message);
          break;

        case 'call-ended':
          // Notify both parties that call ended
          await notifyCallEnded(supabaseClient, message);
          activeCallId = null;
          break;

        default:
          console.log('Unknown signaling message type:', message.type);
      }

    } catch (error) {
      console.error('Error processing signaling message:', error);
      socket.send(JSON.stringify({
        type: 'error',
        message: 'Failed to process signaling message'
      }));
    }
  };

  socket.onclose = async () => {
    console.log("WebSocket connection closed");
    
    // If user disconnects during active call, notify the other party
    if (activeCallId && userId) {
      await notifyCallEnded(supabaseClient, {
        type: 'call-ended',
        callId: activeCallId,
        fromUserId: userId,
        toUserId: '', // Will be resolved in the function
        payload: { reason: 'disconnect' }
      });
    }
  };

  socket.onerror = (error) => {
    console.error("WebSocket error:", error);
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