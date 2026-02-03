-- Insert rate cards for The Rockin Testers
INSERT INTO band_rate_cards (band_id, event_type, price, duration, description) VALUES
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Wedding', 2000, '4 hours', 'Full ceremony and reception performance with custom setlist'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Corporate Event', 1500, '3 hours', 'Professional entertainment for company events and galas'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Private Party', 1200, '3 hours', 'High-energy rock performance for birthdays and celebrations'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Festival', 3000, '2 hours', 'Full stage show with lights and effects');

-- Insert videos for The Rockin Testers
INSERT INTO band_videos (band_id, title, video_url, thumbnail_url, platform) VALUES
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Live at Austin City Limits', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=225&fit=crop', 'youtube'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Unplugged Session', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&h=225&fit=crop', 'youtube'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Wedding Highlights Reel', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=225&fit=crop', 'youtube');

-- Insert upcoming events for The Rockin Testers
INSERT INTO band_events (band_id, name, venue, event_date, event_time, ticket_url, image_url, is_visible) VALUES
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Rock the Block Festival', 'Zilker Park', '2026-03-15', '19:00', 'https://example.com/tickets', 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=200&fit=crop', true),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Downtown Live', 'The Paramount Theatre', '2026-04-20', '20:00', 'https://example.com/tickets', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=200&fit=crop', true);