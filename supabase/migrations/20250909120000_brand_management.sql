-- Create brand_settings table for managing application branding
CREATE TABLE IF NOT EXISTS public.brand_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key TEXT UNIQUE NOT NULL,
  setting_value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_by UUID REFERENCES auth.users(id)
);

-- Create storage bucket for brand assets
INSERT INTO storage.buckets (id, name, public)
VALUES ('brand-assets', 'brand-assets', true);

-- Enable RLS on brand_settings
ALTER TABLE public.brand_settings ENABLE ROW LEVEL SECURITY;

-- Only admins can manage brand settings
CREATE POLICY "Only main admin can manage brand settings" ON public.brand_settings
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.user_id = auth.uid() AND p.is_main_admin = TRUE
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.user_id = auth.uid() AND p.is_main_admin = TRUE
    )
  );

-- Allow admins to read brand settings
CREATE POLICY "Admins can read brand settings" ON public.brand_settings
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.user_id = auth.uid() AND p.role = 'admin'
    )
  );

-- Storage policies for brand assets
CREATE POLICY "Main admin can upload brand assets" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'brand-assets' AND
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.user_id = auth.uid() AND p.is_main_admin = TRUE
    )
  );

CREATE POLICY "Main admin can update brand assets" ON storage.objects
  FOR UPDATE TO authenticated
  USING (
    bucket_id = 'brand-assets' AND
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.user_id = auth.uid() AND p.is_main_admin = TRUE
    )
  );

CREATE POLICY "Main admin can delete brand assets" ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'brand-assets' AND
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.user_id = auth.uid() AND p.is_main_admin = TRUE
    )
  );

-- Everyone can view brand assets (public bucket)
CREATE POLICY "Everyone can view brand assets" ON storage.objects
  FOR SELECT TO public
  USING (bucket_id = 'brand-assets');

-- Insert default brand settings
INSERT INTO public.brand_settings (setting_key, setting_value) VALUES
  ('logo_mainLogo', '/dk-logo.svg'),
  ('logo_largeLogo', '/dk-logo-large.svg'),
  ('logo_favicon', '/dk-logo.svg'),
  ('logo_sidebarLogo', '/dk-logo.svg'),
  ('brand_name', 'DK Smart Attendance'),
  ('brand_description', 'Professional attendance management system'),
  ('primary_color', '#2563eb'),
  ('secondary_color', '#10b981')
ON CONFLICT (setting_key) DO NOTHING;

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_brand_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  NEW.updated_by = auth.uid();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_brand_settings_updated_at
  BEFORE UPDATE ON public.brand_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_brand_settings_updated_at();
