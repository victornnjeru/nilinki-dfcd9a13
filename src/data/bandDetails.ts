export interface BandVideo {
  id: string;
  title: string;
  youtubeId: string;
  thumbnail: string;
}

export interface RateCard {
  eventType: string;
  description: string;
  startingRate: number;
  duration: string;
}

export interface Review {
  id: string;
  author: string;
  authorImage: string;
  rating: number;
  date: string;
  eventType: string;
  content: string;
}

export interface BandEvent {
  id: string;
  title: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  ticketUrl: string;
}

export interface BandDetails {
  id: string;
  name: string;
  tagline: string;
  genre: string;
  location: string;
  rating: number;
  reviewCount: number;
  memberCount: number;
  yearsActive: number;
  imageUrl: string;
  coverUrl: string;
  bio: string;
  videos: BandVideo[];
  rateCard: RateCard[];
  reviews: Review[];
  upcomingEvents: BandEvent[];
}

export const mockBandDetails: Record<string, BandDetails> = {
  "1": {
    id: "1",
    name: "The Midnight Echoes",
    tagline: "Bringing jazz to life since 2015",
    genre: "Jazz",
    location: "New York, USA",
    rating: 4.9,
    reviewCount: 127,
    memberCount: 5,
    yearsActive: 10,
    imageUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&h=600&fit=crop",
    coverUrl: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=1600&h=600&fit=crop",
    bio: `The Midnight Echoes is a New York-based jazz ensemble that has been captivating audiences since 2015. Our sound blends classic jazz traditions with contemporary influences, creating an atmosphere that's both sophisticated and accessible.

With over 500 performances under our belt, we've played at venues ranging from intimate clubs to grand ballrooms. Our repertoire spans the golden age of jazz to modern interpretations, ensuring we can set the perfect mood for any occasion.

Each member brings decades of experience and a passion for creating unforgettable musical moments. Whether it's a corporate gala, wedding reception, or private party, we tailor our performance to match your vision.`,
    videos: [
      {
        id: "v1",
        title: "Live at Blue Note NYC",
        youtubeId: "dQw4w9WgXcQ",
        thumbnail: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=225&fit=crop",
      },
      {
        id: "v2",
        title: "Wedding Performance Highlights",
        youtubeId: "dQw4w9WgXcQ",
        thumbnail: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=225&fit=crop",
      },
      {
        id: "v3",
        title: "Corporate Gala 2024",
        youtubeId: "dQw4w9WgXcQ",
        thumbnail: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=225&fit=crop",
      },
    ],
    rateCard: [
      {
        eventType: "Wedding",
        description: "Full ceremony and reception coverage with customized setlist",
        startingRate: 2500,
        duration: "4-6 hours",
      },
      {
        eventType: "Corporate Event",
        description: "Professional entertainment for galas, conferences, and parties",
        startingRate: 2000,
        duration: "3-4 hours",
      },
      {
        eventType: "Private Party",
        description: "Birthday celebrations, anniversaries, and special occasions",
        startingRate: 1500,
        duration: "2-3 hours",
      },
      {
        eventType: "Club/Venue",
        description: "Live performance sets for venues and music clubs",
        startingRate: 1200,
        duration: "2 sets (90 min)",
      },
    ],
    reviews: [
      {
        id: "r1",
        author: "Jennifer Martinez",
        authorImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
        rating: 5,
        date: "2024-12-15",
        eventType: "Wedding",
        content: "The Midnight Echoes made our wedding absolutely magical! Their jazz renditions of our favorite songs had everyone on the dance floor. Highly professional and incredibly talented.",
      },
      {
        id: "r2",
        author: "David Thompson",
        authorImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
        rating: 5,
        date: "2024-11-20",
        eventType: "Corporate Event",
        content: "We hired them for our annual company gala and they exceeded all expectations. The ambiance they created was perfect for networking while still being entertaining.",
      },
      {
        id: "r3",
        author: "Sarah Kim",
        authorImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
        rating: 5,
        date: "2024-10-08",
        eventType: "Private Party",
        content: "Booked them for my husband's 50th birthday and they were phenomenal. They learned his favorite songs and the surprise performance brought tears to his eyes.",
      },
    ],
    upcomingEvents: [
      {
        id: "e1",
        title: "Jazz Night at Blue Note",
        venue: "Blue Note Jazz Club",
        location: "New York, NY",
        date: "2025-02-14",
        time: "8:00 PM",
        ticketUrl: "https://example.com/tickets/1",
      },
      {
        id: "e2",
        title: "Valentine's Special",
        venue: "The Roosevelt Hotel",
        location: "New York, NY",
        date: "2025-02-15",
        time: "7:30 PM",
        ticketUrl: "https://example.com/tickets/2",
      },
    ],
  },
  "2": {
    id: "2",
    name: "Electric Pulse",
    tagline: "Electronic beats that move your soul",
    genre: "Electronic",
    location: "Berlin, Germany",
    rating: 4.8,
    reviewCount: 89,
    memberCount: 3,
    yearsActive: 8,
    imageUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&h=600&fit=crop",
    coverUrl: "https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?w=1600&h=600&fit=crop",
    bio: `Electric Pulse brings the energy of Berlin's legendary club scene to events worldwide. Our signature blend of house, techno, and electro creates an unforgettable atmosphere that keeps crowds moving all night long.

Founded in 2017, we've performed at major festivals across Europe and have become a favorite for high-energy corporate parties and exclusive private events. Our live sets feature custom visuals and state-of-the-art sound design.

We don't just play music – we create experiences. From intimate rooftop gatherings to massive warehouse parties, Electric Pulse knows how to read a crowd and deliver exactly what they need.`,
    videos: [
      {
        id: "v1",
        title: "Berghain Live Set",
        youtubeId: "dQw4w9WgXcQ",
        thumbnail: "https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?w=400&h=225&fit=crop",
      },
      {
        id: "v2",
        title: "Festival Highlights 2024",
        youtubeId: "dQw4w9WgXcQ",
        thumbnail: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&h=225&fit=crop",
      },
    ],
    rateCard: [
      {
        eventType: "Festival",
        description: "Main stage or tent performances with full production",
        startingRate: 5000,
        duration: "2-3 hours",
      },
      {
        eventType: "Club Night",
        description: "Extended DJ sets for nightclubs and venues",
        startingRate: 2500,
        duration: "4-6 hours",
      },
      {
        eventType: "Corporate Party",
        description: "High-energy entertainment for company celebrations",
        startingRate: 3000,
        duration: "3-4 hours",
      },
      {
        eventType: "Private Event",
        description: "Exclusive performances for private parties",
        startingRate: 2000,
        duration: "3 hours",
      },
    ],
    reviews: [
      {
        id: "r1",
        author: "Marcus Weber",
        authorImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
        rating: 5,
        date: "2024-12-01",
        eventType: "Club Night",
        content: "Electric Pulse absolutely destroyed our club night! The energy was incredible from start to finish. Already booking them for next quarter.",
      },
      {
        id: "r2",
        author: "Lisa Mueller",
        authorImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop",
        rating: 4,
        date: "2024-11-15",
        eventType: "Corporate Party",
        content: "Great performance at our tech company's launch party. They really knew how to build the energy throughout the night.",
      },
    ],
    upcomingEvents: [
      {
        id: "e1",
        title: "Techno Thursday",
        venue: "Watergate Club",
        location: "Berlin, Germany",
        date: "2025-02-20",
        time: "11:00 PM",
        ticketUrl: "https://example.com/tickets/3",
      },
    ],
  },
};

// Helper to get band details with fallback
export const getBandDetails = (id: string): BandDetails | null => {
  return mockBandDetails[id] || null;
};
