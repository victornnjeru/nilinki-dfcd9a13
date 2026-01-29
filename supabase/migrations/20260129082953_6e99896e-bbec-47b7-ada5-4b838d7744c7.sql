-- Drop old functions and create new safer versions using SECURITY INVOKER
-- These functions use auth.uid() directly instead of accepting a user_id parameter

-- Replace has_role with current_user_has_role (SECURITY INVOKER)
CREATE OR REPLACE FUNCTION public.current_user_has_role(_role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = auth.uid()
      AND role = _role
  )
$$;

-- Replace get_user_band_id with get_current_user_band_id (SECURITY INVOKER)
CREATE OR REPLACE FUNCTION public.get_current_user_band_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT id FROM public.bands 
  WHERE user_id = auth.uid()
  LIMIT 1
$$;

-- Drop the old SECURITY DEFINER functions
DROP FUNCTION IF EXISTS public.has_role(uuid, app_role);
DROP FUNCTION IF EXISTS public.get_user_band_id(uuid);