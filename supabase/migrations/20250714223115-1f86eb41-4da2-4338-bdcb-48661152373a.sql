-- Add user approval and role management system
-- Add approval and role fields to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'viewer';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES public.profiles(id);
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP WITH TIME ZONE;

-- Set tfornes@vfiels.com as superuser
UPDATE public.profiles 
SET is_approved = true, role = 'superuser' 
WHERE email = 'tfornes@vfiels.com';

-- Create RLS policies for user management
CREATE POLICY "Superuser can view all profiles" ON public.profiles
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'superuser'
  )
);

CREATE POLICY "Admins can view all profiles" ON public.profiles
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role IN ('admin', 'superuser')
  )
);

CREATE POLICY "Superuser can update any profile" ON public.profiles
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'superuser'
  )
);

CREATE POLICY "Admin can update non-superuser profiles" ON public.profiles
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role IN ('admin', 'superuser')
  ) AND role != 'superuser'
);

-- Only superuser can delete profiles (tfornes@vfiels.com)
CREATE POLICY "Only superuser can delete profiles" ON public.profiles
FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND email = 'tfornes@vfiels.com'
  )
);