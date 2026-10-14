export type Dosha = 'Vata' | 'Pitta' | 'Kapha' | 'Tridoshic';

export interface ApothecaryProduct {
  id: string;
  compoundNo: string;
  name: string;
  sanskritName: string;
  price: number;
  subscriptionPrice: number;
  size: string;
  dosha: Dosha;
  category: 'Elixirs' | 'Oils' | 'Rasayana' | 'Botanicals' | 'Teas';
  shortDesc: string;
  description: string;
  ingredients: string[];
  benefits: string[];
  howToUse: string;
  image: string;
  badge?: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  featured?: boolean;
}

export interface CartItem {
  product: ApothecaryProduct;
  quantity: number;
  isSubscription?: boolean;
}

export interface Herb {
  id: string;
  commonName: string;
  sanskritName: string;
  botanicalName: string;
  primaryDosha: Dosha;
  taste: string; // Rasa
  potency: string; // Virya
  postDigestive: string; // Vipaka
  indications: string[];
  description: string;
  image: string;
}

export interface RitualStep {
  title: string;
  durationMinutes: number;
  instruction: string;
  mantra?: string;
}

export interface Ritual {
  id: string;
  title: string;
  sanskritTitle: string;
  category: string;
  durationCadence: string;
  vaidya: string;
  image: string;
  description: string;
  steps: RitualStep[];
  productsUsed: string[];
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  discount: number;
  shippingAddress: {
    fullName: string;
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: string;
  status: 'Processing' | 'Dispensed' | 'Shipped' | 'Delivered';
}

export interface SpaSession {
  id: string;
  title: string;
  sanskritName: string;
  tagline: string;
  durationMinutes: number;
  price: number;
  therapist: string;
  therapistRole: string;
  image: string;
  category: 'Shirodhara' | 'Abhyanga' | 'Marma Therapy' | 'Herbal Compress';
  description: string;
  benefits: string[];
  steps: string[];
  rating: number;
  reviewsCount: number;
}

export interface YogaPose {
  name: string;
  sanskritName: string;
  durationSeconds: number;
  instruction: string;
  focusArea: string;
}

export interface YogaSession {
  id: string;
  title: string;
  sanskritTitle?: string;
  level: 'Beginner' | 'Intermediate' | 'All Levels';
  durationMinutes: number;
  instructor: string;
  instructorRole: string;
  category: 'Morning Flow' | 'Desk Relief' | 'Restorative Yin' | 'Breathwork & Nidra';
  thumbnail: string;
  description: string;
  poses: YogaPose[];
  intensity: 'Gentle' | 'Moderate' | 'Energizing';
  enrolledCount: number;
}

export interface SpaBooking {
  id: string;
  sessionTitle: string;
  therapist: string;
  date: string;
  timeSlot: string;
  clientName: string;
  clientEmail: string;
  price: number;
  status: 'Confirmed' | 'Completed';
}

export interface DailyVitalsLog {
  date: string;
  dayLabel: string;
  sleepQuality: number; // 1-10
  energyLevel: number; // 1-10
  digestion: number; // 1-10
  notes?: string;
  loggedAt: number;
}

export interface DoshaScore {
  vata: number;
  pitta: number;
  kapha: number;
  dominant: Dosha;
}
