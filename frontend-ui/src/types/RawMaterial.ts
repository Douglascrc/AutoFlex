export interface RawMaterial {
  id: number;
  name: string;
  description: string;
  cost: number;
  currentStock: number;
}

export interface RawMaterialRequest {
  name: string;
  description: string;
  cost: number;
  currentStock: number;
}

export interface ProductRawMaterial {
  rawMaterialId: number;
  quantity: number;
}
