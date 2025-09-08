# Security Configuration Guide

This file contains important security information for setting up the Smart Attendance System.

## Environment Variables Setup

### Required Files (NOT in version control)
- `.env` - Contains your actual Supabase credentials
- `supabase/config.toml` - Contains your Supabase project configuration

### Template Files (Safe to commit)
- `.env.example` - Template for environment variables
- `supabase/config.toml.example` - Template for Supabase configuration

## Setup Instructions

1. **Copy template files:**
   ```bash
   cp .env.example .env
   cp supabase/config.toml.example supabase/config.toml
   ```

2. **Get your Supabase credentials:**
   - Visit your [Supabase Dashboard](https://supabase.com/dashboard)
   - Go to Settings > API
   - Copy the Project URL and anon/public key

3. **Update your .env file:**
   ```
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your_actual_anon_key_here
   ```

4. **Update your supabase/config.toml file:**
   ```
   project_id = "your_actual_project_id_here"
   ```

## Security Best Practices

- ✅ Never commit `.env` files
- ✅ Never commit `config.toml` files with real credentials
- ✅ Always use `.example` files as templates
- ✅ Keep API keys and secrets out of version control
- ✅ Use different credentials for development and production

## Demo Credentials

The following demo credentials are for development/testing only:
- Student: john@university.edu / student123
- Teacher: mike@university.edu / teacher123  
- Admin: sarah@university.edu / admin123

⚠️ **Change these credentials in production!**
