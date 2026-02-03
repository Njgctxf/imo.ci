export type UserRole = 'tenant' | 'owner' | 'admin';

export type PropertyType = 'apartment' | 'villa' | 'land' | 'office' | 'house';
export type ListingType = 'sale' | 'rent';
export type PropertyStatus = 'available' | 'reserved' | 'rented' | 'sold';
export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';
export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';

export interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  phone: string | null;
  role: UserRole;
  avatar_url: string | null;
  verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface Property {
  id: string;
  owner_id: string;
  title: string;
  description: string | null;
  property_type: PropertyType;
  listing_type: ListingType;
  status: PropertyStatus;
  price: number;
  location: string;
  address: string | null;
  city: string | null;
  area_sqm: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  images: string[];
  amenities: string[];
  available_from: string | null;
  created_at: string;
  updated_at: string;
  views: number;
}

export interface Booking {
  id: string;
  property_id: string;
  tenant_id: string;
  owner_id: string;
  start_date: string;
  end_date: string | null;
  total_amount: number;
  status: BookingStatus;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  booking_id: string;
  tenant_id: string;
  owner_id: string;
  amount: number;
  payment_method: string;
  status: PaymentStatus;
  transaction_id: string | null;
  created_at: string;
  completed_at: string | null;
}

export interface Notification {
  id: string;
  user_id: string;
  type: 'booking' | 'payment' | 'message' | 'system';
  title: string;
  message: string;
  read: boolean;
  data: Record<string, any> | null;
  created_at: string;
}
