-- Fix has_role function to only allow users to check their own roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
      AND _user_id = auth.uid()
  )
$$;

-- Fix get_user_band_id function to only return band_id for the requesting user
CREATE OR REPLACE FUNCTION public.get_user_band_id(_user_id uuid)
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id FROM public.bands 
  WHERE user_id = _user_id 
    AND user_id = auth.uid()
  LIMIT 1
$$;