-- Add policies to prevent users from modifying or deleting their roles
-- This prevents privilege escalation attacks

CREATE POLICY "Users cannot update roles" 
  ON public.user_roles 
  FOR UPDATE 
  USING (false);

CREATE POLICY "Users cannot delete roles" 
  ON public.user_roles 
  FOR DELETE 
  USING (false);