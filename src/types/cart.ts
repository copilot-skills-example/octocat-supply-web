export interface CartItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  imgName?: string;
}

export interface CreateOrderPayload {
  branchId: number;
  items: { productId: number; quantity: number }[];
}
