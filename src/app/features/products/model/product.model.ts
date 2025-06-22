export interface Product {
  id?: number;
  name: string;
  price: number;
  description?: string;
  quantity: number;
  sku?: string;
  createdAt?: string;
  updatedAt?: string;
  producerId?: number;
  categoryIds?: number[];
  tagIds?: number[];

  image?: string;
  category?: string;
  rating?: number;
  inventoryStatus?: string;
  active?: boolean;
  stock?: number;

  producerName?: string; // Nombre del productor
  producerLocation?: string; // Ubicación del productor
  aiRecommendationScore: any;
}
