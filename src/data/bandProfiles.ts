import type { Band } from "@/components/cards/BandCard";
import { mockBands } from "./mockData";

export interface Video {
  id: string;
  title: string;
  thumbnailUrl: string;
  videoUrl: string;
  platform: "youtube" | "vimeo";
}

export interface RateCard {
  eventType: string;
  price: number;
  duration: string;
  description: string;
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

export interface UpcomingEvent {
  id: string;
  name: string;
  venue: string;
  date: string;
  time: string;
  ticketUrl: string;
  imageUrl: string;
}

export interface BandProfile extends Band {
  coverUrl: string;
  bio: string;
  longBio: string;
  yearsActive: number;
  members: number;
  videos: Video[];
  rateCards: RateCard[];
  reviews: Review[];
  upcomingEvents: UpcomingEvent[];
  socialLinks: {
    instagram?: string;
    facebook?: string;
    youtube?: string;
    spotify?: string;
  };
}

// Extended profiles for each mock band
export const bandProfiles: Record<string, BandProfile> = {
  "1": {
    ...mockBands[0],
    coverUrl: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=1920&h=600&fit=crop",
    bio: "Award-winning jazz ensemble bringing sophisticated sounds to your special events.",
    longBio: "The Midnight Echoes have been captivating audiences for over a decade with their unique blend of classic jazz standards and contemporary interpretations. Based in the heart of New York City, our quintet has performed at hundreds of prestigious events, from intimate cocktail parties to grand ballroom galas. Our repertoire spans the golden age of jazz through modern jazz fusion, ensuring the perfect ambiance for any occasion.",
    yearsActive: 12,
    members: 5,
    videos: [
      {
        id: "v1",
        title: "Live at Blue Note NYC",
        thumbnailUrl: "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=400&h=225&fit=crop",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        platform: "youtube",
      },
      {
        id: "v2",
        title: "Wedding Performance Highlights",
        thumbnailUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&h=225&fit=crop",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        platform: "youtube",
      },
      {
        id: "v3",
        title: "Corporate Gala Set",
        thumbnailUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=225&fit=crop",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        platform: "youtube",
      },
    ],
    rateCards: [
      { eventType: "Wedding", price: 2500, duration: "4 hours", description: "Full ceremony and reception coverage" },
      { eventType: "Corporate Event", price: 2000, duration: "3 hours", description: "Background music and one feature set" },
      { eventType: "Private Party", price: 1500, duration: "3 hours", description: "Customized playlist and requests" },
      { eventType: "Club Night", price: 1800, duration: "2 sets", description: "High-energy performance sets" },
    ],
    reviews: [
      {
        id: "r1",
        author: "Jennifer Martinez",
        authorImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
        rating: 5,
        date: "2024-01-15",
        eventType: "Wedding",
        content: "The Midnight Echoes made our wedding absolutely magical! Their music set the perfect tone for both the ceremony and reception. Guests are still talking about them!",
      },
      {
        id: "r2",
        author: "David Chen",
        authorImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
        rating: 5,
        date: "2024-01-02",
        eventType: "Corporate Event",
        content: "Professional, talented, and incredibly easy to work with. They read the room perfectly and adjusted their set to match the energy of our company party.",
      },
      {
        id: "r3",
        author: "Sarah Thompson",
        authorImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
        rating: 4,
        date: "2023-12-20",
        eventType: "Private Party",
        content: "Fantastic performers! They learned two of our favorite songs just for our anniversary party. Highly recommend!",
      },
    ],
    upcomingEvents: [
      {
        id: "e1",
        name: "Jazz Under the Stars",
        venue: "Central Park SummerStage",
        date: "2024-03-15",
        time: "7:00 PM",
        ticketUrl: "https://example.com/tickets",
        imageUrl: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=200&fit=crop",
      },
      {
        id: "e2",
        name: "Blue Note Residency",
        venue: "Blue Note Jazz Club",
        date: "2024-03-22",
        time: "9:00 PM",
        ticketUrl: "https://example.com/tickets",
        imageUrl: "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=400&h=200&fit=crop",
      },
    ],
    socialLinks: {
      instagram: "https://instagram.com",
      facebook: "https://facebook.com",
      youtube: "https://youtube.com",
      spotify: "https://spotify.com",
    },
  },
  "2": {
    ...mockBands[1],
    coverUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1920&h=600&fit=crop",
    bio: "Berlin's premier electronic act delivering pulsating beats and immersive experiences.",
    longBio: "Electric Pulse emerged from Berlin's legendary club scene, combining cutting-edge production with electrifying live performance. Our shows are a multi-sensory journey featuring custom visuals, synchronized lighting, and genre-defying electronic music that keeps crowds moving all night long.",
    yearsActive: 8,
    members: 3,
    videos: [
      {
        id: "v1",
        title: "Berghain Live Set",
        thumbnailUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=225&fit=crop",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        platform: "youtube",
      },
    ],
    rateCards: [
      { eventType: "Festival", price: 5000, duration: "2 hours", description: "Full production with visuals" },
      { eventType: "Club Night", price: 2500, duration: "4 hours", description: "DJ set with live elements" },
      { eventType: "Private Event", price: 3000, duration: "3 hours", description: "Custom experience" },
    ],
    reviews: [
      {
        id: "r1",
        author: "Klaus Weber",
        authorImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
        rating: 5,
        date: "2024-01-10",
        eventType: "Club Night",
        content: "Absolutely incredible energy! They transformed our venue into a Berlin club for the night.",
      },
    ],
    upcomingEvents: [],
    socialLinks: {
      instagram: "https://instagram.com",
      spotify: "https://spotify.com",
    },
  },
};

// Get profile by ID with fallback
export function getBandProfile(id: string): BandProfile | undefined {
  if (bandProfiles[id]) {
    return bandProfiles[id];
  }
  
  // Generate a basic profile from mockBands if not in detailed profiles
  const band = mockBands.find(b => b.id === id);
  if (band) {
    return {
      ...band,
      coverUrl: band.imageUrl,
      bio: `Professional ${band.genre.toLowerCase()} band based in ${band.location}.`,
      longBio: `We are a passionate ${band.genre.toLowerCase()} band dedicated to delivering unforgettable live performances. With years of experience performing at various venues and events, we bring energy, professionalism, and exceptional musicianship to every show.`,
      yearsActive: 5,
      members: 4,
      videos: [],
      rateCards: [
        { eventType: "Standard Event", price: band.startingRate, duration: "3 hours", description: "Full performance" },
      ],
      reviews: [],
      upcomingEvents: [],
      socialLinks: {},
    };
  }
  
  return undefined;
}
