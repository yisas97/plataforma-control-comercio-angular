export interface Product {
  id?: number;
  name: string;
  price: number;
  description?: string;
  quantity?: number;
  sku?: string;
  producer?: any;
  categoryIds?: number[];
  tagIds?: number[];
}
