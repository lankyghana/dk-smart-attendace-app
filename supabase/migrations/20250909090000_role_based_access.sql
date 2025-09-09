-- Enforce role-based access for admin actions
-- Only allow admins to select all, and only main admin to insert new admins

-- Allow only admins to select all profiles
CREATE POLICY "Admins can view all profiles" ON public.profiles
FOR SELECT TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.profiles p WHERE p.user_id = auth.uid() AND p.role = 'admin'
));

-- Only main admin can insert new admins
CREATE POLICY "Main admin can add new admins" ON public.profiles
FOR INSERT TO authenticated
WITH CHECK (
  (role != 'admin') OR
  (EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.user_id = auth.uid() 
      AND p.role = 'admin' 
      AND p.name = 'Main Admin' -- or use email if available
  ))
);

-- Prevent non-main admins from creating new admin users
-- (Assumes main admin is identified by name or a unique email)

-- Restrict updates to admin role only by main admin
CREATE POLICY "Only main admin can update admin roles" ON public.profiles
FOR UPDATE TO authenticated
USING (
  (role != 'admin') OR
  (EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.user_id = auth.uid() 
      AND p.role = 'admin' 
      AND p.name = 'Main Admin' -- or use email if available
  ))
);

-- Teachers and students can only select/update their own profile
-- (already enforced by existing policies)
