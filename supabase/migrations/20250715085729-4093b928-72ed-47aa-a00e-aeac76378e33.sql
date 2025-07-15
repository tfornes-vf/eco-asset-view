-- Drop all existing policies that cause recursion
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Superuser views all" ON public.profiles;
DROP POLICY IF EXISTS "Superuser updates all" ON public.profiles;
DROP POLICY IF EXISTS "Superuser deletes" ON public.profiles;

-- Create security definer function to avoid recursion
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE user_id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Create security definer function to check if user is superuser by email
CREATE OR REPLACE FUNCTION public.is_superuser()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND auth.users.email = 'tfornes@vfiels.com'
  );
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Create simple policies using the functions
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

-- Superuser can view all profiles
CREATE POLICY "Superuser views all" 
ON public.profiles 
FOR SELECT 
USING (public.is_superuser());

-- Admins can view all profiles (using the function)
CREATE POLICY "Admins view all" 
ON public.profiles 
FOR SELECT 
USING (public.get_current_user_role() IN ('admin', 'superuser'));

-- Superuser can update any profile
CREATE POLICY "Superuser updates all" 
ON public.profiles 
FOR UPDATE 
USING (public.is_superuser());

-- Admins can update non-superuser profiles
CREATE POLICY "Admins update non-superuser" 
ON public.profiles 
FOR UPDATE 
USING (
  role != 'superuser' 
  AND public.get_current_user_role() IN ('admin', 'superuser')
);

-- Only superuser can delete profiles
CREATE POLICY "Superuser deletes" 
ON public.profiles 
FOR DELETE 
USING (public.is_superuser());