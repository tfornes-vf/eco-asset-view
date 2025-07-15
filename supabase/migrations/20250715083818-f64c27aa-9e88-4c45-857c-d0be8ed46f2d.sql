-- Drop ALL existing policies first
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Superuser can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admin can update non-superuser profiles" ON public.profiles;
DROP POLICY IF EXISTS "Superuser can update any profile" ON public.profiles;
DROP POLICY IF EXISTS "Only superuser can delete profiles" ON public.profiles;

-- Create simple, non-recursive policies
-- Users can view their own profile
CREATE POLICY "Users can view own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

-- Users can update their own profile  
CREATE POLICY "Users can update own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Superuser (by email) can view all profiles
CREATE POLICY "Superuser views all" 
ON public.profiles 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND auth.users.email = 'tfornes@vfiels.com'
  )
);

-- Superuser can update any profile
CREATE POLICY "Superuser updates all" 
ON public.profiles 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND auth.users.email = 'tfornes@vfiels.com'
  )
);

-- Only superuser can delete profiles  
CREATE POLICY "Superuser deletes" 
ON public.profiles 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND auth.users.email = 'tfornes@vfiels.com'
  )
);