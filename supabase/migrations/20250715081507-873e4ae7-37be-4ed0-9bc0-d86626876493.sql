-- Drop all existing policies that cause recursion
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Superuser can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admin can update non-superuser profiles" ON public.profiles;
DROP POLICY IF EXISTS "Superuser can update any profile" ON public.profiles;
DROP POLICY IF EXISTS "Only superuser can delete profiles" ON public.profiles;

-- Create simple, non-recursive policies
-- Users can always view their own profile
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

-- Users can update their own profile
CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Users can insert their own profile
CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Superuser can view all profiles (using email directly to avoid recursion)
CREATE POLICY "Superuser can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND auth.users.email = 'tfornes@vfiels.com'
  )
);

-- Admins and superusers can view all profiles (check role in same row)
CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (
  -- Current user is admin/superuser
  (auth.uid() = user_id AND role IN ('admin', 'superuser'))
  OR
  -- Or superuser by email
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND auth.users.email = 'tfornes@vfiels.com'
  )
);

-- Superuser can update any profile
CREATE POLICY "Superuser can update any profile" 
ON public.profiles 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND auth.users.email = 'tfornes@vfiels.com'
  )
);

-- Admins can update non-superuser profiles
CREATE POLICY "Admin can update non-superuser profiles" 
ON public.profiles 
FOR UPDATE 
USING (
  role != 'superuser' 
  AND (
    -- Current user is admin/superuser  
    (auth.uid() = user_id AND role IN ('admin', 'superuser'))
    OR
    -- Or superuser by email
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email = 'tfornes@vfiels.com'
    )
  )
);

-- Only superuser can delete profiles
CREATE POLICY "Only superuser can delete profiles" 
ON public.profiles 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND auth.users.email = 'tfornes@vfiels.com'
  )
);