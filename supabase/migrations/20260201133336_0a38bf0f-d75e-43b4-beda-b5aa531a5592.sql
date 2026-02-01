-- Create test band for quote flow testing
INSERT INTO public.bands (id, user_id, name, genre, location, bio, long_bio)
VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  '62870162-babc-4f4d-83d4-4ef165c19099',
  'The Rockin Testers',
  'Rock',
  'Austin, TX',
  'A high-energy rock band perfect for any event!',
  'The Rockin Testers have been electrifying audiences since 2015. With a mix of classic rock covers and original songs, they bring the house down at every performance. Perfect for weddings, corporate events, and private parties.'
);