# 🚀 Vercel Deployment Instructions

## Quick Deployment Steps:

### **Method 1: Vercel Dashboard (Recommended)**

1. **Go to**: https://vercel.com/dashboard
2. **Click**: "New Project"
3. **Import from GitHub**: Select your `dk-smart-attendace-app` repository
4. **Configure Project**:
   - Framework Preset: Vite
   - Root Directory: `./` (leave as default)
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

5. **Add Environment Variables**:
   - `VITE_SUPABASE_URL` = your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY` = your Supabase anon key

6. **Click "Deploy"**

### **Method 2: CLI (After creating account)**

```bash
# Login to Vercel
vercel login

# Deploy
vercel

# Follow the prompts:
# - Link to existing project? No
# - Project name: dk-smart-attendance
# - Directory: ./
# - Want to override settings? No
```

## 🔧 **Environment Variables Needed**

You'll need these from your Supabase dashboard:

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

**Get them from**: Supabase Dashboard → Settings → API

## 🎯 **Your Final URL Will Be**:
```
https://dk-smart-attendace-app-[random].vercel.app
```

## ✅ **Next Steps After Deployment**:

1. **Test your live app**
2. **Set up Supabase production database**
3. **Configure authentication redirects**
4. **Add custom domain** (optional)

---

## 🆘 **Need Help?**

1. **Create Vercel account**: https://vercel.com/signup
2. **Vercel docs**: https://vercel.com/docs
3. **Your project is ready!** 🎉
