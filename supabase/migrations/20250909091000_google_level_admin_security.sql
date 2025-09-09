-- Add is_main_admin column for robust admin identification
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_main_admin BOOLEAN DEFAULT FALSE;

-- Only main admin can create or update admin users
CREATE POLICY "Main admin can add/update admins" ON public.profiles
  FOR INSERT, UPDATE TO authenticated
  USING (
    (role != 'admin') OR
    (EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.user_id = auth.uid() AND p.is_main_admin = TRUE
    ))
  )
  WITH CHECK (
    (role != 'admin') OR
    (EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.user_id = auth.uid() AND p.is_main_admin = TRUE
    ))
  );

-- Only admins can view all profiles
CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.user_id = auth.uid() AND p.role = 'admin'
    )
  );

-- Users can view/update their own profile (already present)
-- Add audit log table for admin actions
CREATE TABLE IF NOT EXISTS public.admin_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID NOT NULL REFERENCES auth.users(id),
  action TEXT NOT NULL,
  target_user_id UUID,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Only main admin can view audit logs
CREATE POLICY "Main admin can view audit logs" ON public.admin_audit_log
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.user_id = auth.uid() AND p.is_main_admin = TRUE
    )
  );
