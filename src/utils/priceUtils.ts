interface Product {
  price: number;
  discount?: number;
}

/**
 * Calculate the final price of a product after applying any discount
 */
export function calculatePrice(product: Product): number {
  if (product.discount && product.discount > 0) {
    return product.price * (1 - product.discount);
  }
  return product.price;
}
