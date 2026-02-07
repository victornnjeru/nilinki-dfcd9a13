-- Add contact_email column to bands table for booking notifications
ALTER TABLE public.bands
ADD COLUMN contact_email text;

-- Add a comment explaining the column's purpose
COMMENT ON COLUMN public.bands.contact_email IS 'Email address for receiving booking notifications. If null, no email notifications are sent.';