# DK Smart Attendance

A professional attendance management system for educational institutions built by lankyghana.

## Project info

**Repository**: https://github.com/lankyghana/dk-smart-attendace

## Features

- Professional attendance management
- QR code generation for classes
- Student attendance tracking
- Analytics dashboard
- Supabase integration for data management

## How to run this project locally

Follow these steps to set up the project on your local machine:

```sh
# Step 1: Clone the repository
git clone https://github.com/lankyghana/dk-smart-attendace.git

# Step 2: Navigate to the project directory
cd dk-smart-attendace

# Step 3: Set up environment variables
cp .env.example .env
# Edit .env and add your Supabase credentials

# Step 4: Install the necessary dependencies
npm install

# Step 5: Start the development server
npm run dev
```

## Environment Setup

1. **Copy the environment template**:
   ```sh
   cp .env.example .env
   ```

2. **Get your Supabase credentials**:
   - Go to your [Supabase Dashboard](https://supabase.com/dashboard)
   - Select your project
   - Go to Settings > API
   - Copy the Project URL and anon public key

3. **Update your .env file**:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   ```

⚠️ **Security Note**: Never commit your `.env` file to version control. It's already included in `.gitignore`.

## Technologies Used

This project is built with:

- **Vite** - Fast build tool and development server
- **TypeScript** - Type-safe JavaScript
- **React** - UI library
- **shadcn/ui** - Modern UI components
- **Tailwind CSS** - Utility-first CSS framework
- **Supabase** - Backend-as-a-Service for authentication and database
- **React Router** - Client-side routing
- **React Hook Form** - Form handling
- **Lucide React** - Beautiful icons

## Project Structure

- `/src/components/` - Reusable UI components
- `/src/pages/` - Application pages
- `/src/contexts/` - React contexts for state management
- `/src/integrations/` - Third-party service integrations
- `/src/hooks/` - Custom React hooks
- `/supabase/` - Database migrations and configuration

## Contributing

This project is maintained by lankyghana. Feel free to submit issues and enhancement requests!
