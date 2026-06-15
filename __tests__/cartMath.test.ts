import { cartCount, cartSubtotal } from '@/lib/cartMath';
import type { ServerCartItem } from '@/lib/data/types';

const item = (over: Partial<ServerCartItem>): ServerCartItem => ({
  id: 'x', name: 'Foundation', brand: 'Fenty', price: 10, qty: 1, ...over,
});

describe('cart math', () => {
  it('counts total quantity across items', () => {
    expect(cartCount([item({ qty: 2 }), item({ qty: 3 })])).toBe(5);
  });

  it('sums price × qty', () => {
    expect(cartSubtotal([item({ price: 34, qty: 2 }), item({ price: 10, qty: 1 })])).toBe(78);
  });

  it('handles an empty cart', () => {
    expect(cartCount([])).toBe(0);
    expect(cartSubtotal([])).toBe(0);
  });
});
