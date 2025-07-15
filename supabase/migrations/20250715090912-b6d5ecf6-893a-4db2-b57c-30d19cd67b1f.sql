-- Fix the superuser email and approve tfornes@vfields.com
UPDATE public.profiles 
SET is_approved = true, role = 'superuser' 
WHERE email = 'tfornes@vfields.com';

-- Update the is_superuser function to use the correct email
CREATE OR REPLACE FUNCTION public.is_superuser()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND auth.users.email = 'tfornes@vfields.com'
  );
$$ LANGUAGE SQL SECURITY DEFINER STABLE;