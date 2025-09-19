# Running in Replit

This app is designed to work in both Lovable and Replit environments.

## Environment Setup for Replit

1. **Environment Variables**: Create a `.env` file in the root directory with:
   ```
   VITE_SUPABASE_URL=https://lfpnnlkjqpphstpcmcsi.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxmcG5ubGtqcXBwaHN0cGNtY3NpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY1NzQ2NTksImV4cCI6MjA3MjE1MDY1OX0.zLnIk-a1OAdl5e4KWSz774UqL2d51i-7Z2wd_rLxdOA
   ```

2. **Supabase Edge Functions**: 
   - Edge functions in the `supabase/functions` folder won't auto-deploy in Replit
   - You'll need to deploy them manually using the Supabase CLI
   - Install Supabase CLI: `npm install -g supabase`
   - Deploy functions: `supabase functions deploy --project-ref lfpnnlkjqpphstpcmcsi`

3. **Package Management**:
   - Run `npm install` to install dependencies
   - Use `npm run start` to start the development server
   - Use `npm run build` to build for production

## Differences from Lovable

- **Auto-deployment**: Edge functions won't auto-deploy
- **Environment**: Uses different port (3000) and host configuration
- **Build system**: Uses standard Vite instead of Lovable's enhanced build
- **Component tagging**: Lovable's component tagger is disabled in Replit

## Available Scripts

- `npm run start` - Start development server (Replit-optimized)
- `npm run replit:dev` - Same as start
- `npm run replit:build` - Build for production
- `npm run replit:preview` - Preview production build
- `npm run dev` - Standard Vite dev server
- `npm run build` - Standard Vite build