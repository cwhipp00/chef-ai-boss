-- Add notification_settings column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS notification_settings JSONB DEFAULT '{
  "emailNotifications": {
    "courseUpdates": true,
    "assignmentReminders": true,
    "teamUpdates": true,
    "marketing": false
  },
  "pushNotifications": {
    "realTimeAlerts": true,
    "soundNotifications": true,
    "desktopNotifications": false
  },
  "emailFrequency": "daily",
  "preferredTime": "morning"
}'::jsonb;