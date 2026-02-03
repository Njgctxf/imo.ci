export type Profile = {
  id: string;
  email: string | null;
  full_name: string | null;
  phone: string | null;
  user_type: 'proprietaire' | 'locataire' | null;
  created_at: string;
  updated_at: string;
}

export type Property = {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  property_type: 'appartement' | 'maison' | 'studio' | 'villa' | 'terrain' | null;
  price: number;
  location: string;
  bedrooms: number | null;
  bathrooms: number | null;
  area_sqm: number | null;
  is_available: boolean;
  images: string[] | null;
  created_at: string;
  updated_at: string;
}

export type Favorite = {
  id: string;
  user_id: string;
  property_id: string;
  created_at: string;
}

