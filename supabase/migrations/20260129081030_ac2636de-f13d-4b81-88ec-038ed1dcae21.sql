-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('band', 'client');

-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  company TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Create bands table
CREATE TABLE public.bands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  name TEXT NOT NULL,
  genre TEXT NOT NULL,
  location TEXT NOT NULL,
  bio TEXT,
  long_bio TEXT,
  image_url TEXT,
  cover_url TEXT,
  years_active INTEGER DEFAULT 1,
  members INTEGER DEFAULT 1,
  featured BOOLEAN DEFAULT false,
  instagram TEXT,
  facebook TEXT,
  youtube TEXT,
  spotify TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create band_videos table
CREATE TABLE public.band_videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  band_id UUID REFERENCES public.bands(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  thumbnail_url TEXT,
  video_url TEXT NOT NULL,
  platform TEXT NOT NULL DEFAULT 'youtube',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create band_rate_cards table
CREATE TABLE public.band_rate_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  band_id UUID REFERENCES public.bands(id) ON DELETE CASCADE NOT NULL,
  event_type TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  duration TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create band_events table (upcoming public events)
CREATE TABLE public.band_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  band_id UUID REFERENCES public.bands(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  venue TEXT NOT NULL,
  event_date DATE NOT NULL,
  event_time TIME NOT NULL,
  ticket_url TEXT,
  image_url TEXT,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create reviews table
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  band_id UUID REFERENCES public.bands(id) ON DELETE CASCADE NOT NULL,
  author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  event_type TEXT,
  content TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create booking_inquiries table
CREATE TABLE public.booking_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  band_id UUID REFERENCES public.bands(id) ON DELETE CASCADE NOT NULL,
  client_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  event_type TEXT NOT NULL,
  event_date DATE NOT NULL,
  event_location TEXT,
  guest_count INTEGER,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create favorites table
CREATE TABLE public.favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  band_id UUID REFERENCES public.bands(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, band_id)
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.band_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.band_rate_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.band_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- Security definer function to check user role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
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
  )
$$;

-- Function to get band_id for a user
CREATE OR REPLACE FUNCTION public.get_user_band_id(_user_id UUID)
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id FROM public.bands WHERE user_id = _user_id LIMIT 1
$$;

-- Profiles policies
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User roles policies
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own role on signup" ON public.user_roles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Bands policies (public read, owner write)
CREATE POLICY "Anyone can view bands" ON public.bands FOR SELECT USING (true);
CREATE POLICY "Band owners can update their band" ON public.bands FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can create their band" ON public.bands FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Band owners can delete their band" ON public.bands FOR DELETE USING (auth.uid() = user_id);

-- Band videos policies
CREATE POLICY "Anyone can view band videos" ON public.band_videos FOR SELECT USING (true);
CREATE POLICY "Band owners can manage videos" ON public.band_videos FOR ALL USING (
  band_id IN (SELECT id FROM public.bands WHERE user_id = auth.uid())
);

-- Band rate cards policies
CREATE POLICY "Anyone can view rate cards" ON public.band_rate_cards FOR SELECT USING (true);
CREATE POLICY "Band owners can manage rate cards" ON public.band_rate_cards FOR ALL USING (
  band_id IN (SELECT id FROM public.bands WHERE user_id = auth.uid())
);

-- Band events policies
CREATE POLICY "Anyone can view visible events" ON public.band_events FOR SELECT USING (is_visible = true);
CREATE POLICY "Band owners can view all their events" ON public.band_events FOR SELECT USING (
  band_id IN (SELECT id FROM public.bands WHERE user_id = auth.uid())
);
CREATE POLICY "Band owners can manage events" ON public.band_events FOR ALL USING (
  band_id IN (SELECT id FROM public.bands WHERE user_id = auth.uid())
);

-- Reviews policies
CREATE POLICY "Anyone can view reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create reviews" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Authors can update their reviews" ON public.reviews FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Authors can delete their reviews" ON public.reviews FOR DELETE USING (auth.uid() = author_id);

-- Booking inquiries policies
CREATE POLICY "Clients can view their inquiries" ON public.booking_inquiries FOR SELECT USING (auth.uid() = client_id);
CREATE POLICY "Bands can view inquiries for their band" ON public.booking_inquiries FOR SELECT USING (
  band_id IN (SELECT id FROM public.bands WHERE user_id = auth.uid())
);
CREATE POLICY "Clients can create inquiries" ON public.booking_inquiries FOR INSERT WITH CHECK (auth.uid() = client_id);
CREATE POLICY "Bands can update inquiry status" ON public.booking_inquiries FOR UPDATE USING (
  band_id IN (SELECT id FROM public.bands WHERE user_id = auth.uid())
);

-- Favorites policies
CREATE POLICY "Users can view their favorites" ON public.favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can add favorites" ON public.favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can remove favorites" ON public.favorites FOR DELETE USING (auth.uid() = user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Add triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_bands_updated_at BEFORE UPDATE ON public.bands FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_booking_inquiries_updated_at BEFORE UPDATE ON public.booking_inquiries FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to handle new user signup (creates profile automatically)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();