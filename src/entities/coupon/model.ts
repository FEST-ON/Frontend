export interface StampSpot {
  id: string;
  name: string;
  location: string;
  collected: boolean;
}

export interface LocalCoupon {
  id: string;
  store: string;
  category: string;
  discount: string;
  location: string;
  expiresAt: string;
  used: boolean;
}
