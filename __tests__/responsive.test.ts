import { rs } from '@/lib/responsive';

describe('rs (responsive scaling)', () => {
  it('returns a number', () => {
    expect(typeof rs(16)).toBe('number');
  });

  it('maps 0 to 0', () => {
    expect(rs(0)).toBe(0);
  });

  it('stays within the clamped scale range (0.85–1.15×)', () => {
    const v = rs(100);
    expect(v).toBeGreaterThanOrEqual(85);
    expect(v).toBeLessThanOrEqual(115);
  });
});
