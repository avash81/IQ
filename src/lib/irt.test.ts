import { describe, it, expect } from 'vitest';
import { irtProbability, updateTheta, thetaToIQ } from './irt';

describe('IRT Logic', () => {
  it('calculates correct probability for 2PL model', () => {
    // b = 0, a = 1, theta = 0 -> P = 0.5
    expect(irtProbability(0, 0, 1)).toBeCloseTo(0.5);
    // b = 0, a = 1, theta = 2 -> P > 0.5
    expect(irtProbability(2, 0, 1)).toBeGreaterThan(0.5);
    // b = 2, a = 1, theta = 0 -> P < 0.5
    expect(irtProbability(0, 2, 1)).toBeLessThan(0.5);
  });

  it('updates theta correctly on correct answer', () => {
    const initialTheta = 0;
    const updated = updateTheta(initialTheta, true, 0, 1);
    expect(updated).toBeGreaterThan(initialTheta);
  });

  it('updates theta correctly on incorrect answer', () => {
    const initialTheta = 0;
    const updated = updateTheta(initialTheta, false, 0, 1);
    expect(updated).toBeLessThan(initialTheta);
  });

  it('converts theta to IQ correctly', () => {
    // theta = 0 -> IQ = 100
    expect(thetaToIQ(0)).toBe(100);
    // theta = 1 -> IQ = 115
    expect(thetaToIQ(1)).toBe(115);
    // theta = 2 -> IQ = 130
    expect(thetaToIQ(2)).toBe(130);
  });
});
