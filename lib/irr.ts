/**
 * Calculates the Internal Rate of Return (IRR) using the Newton-Raphson method
 * with bisection fallback.
 */
export function calculateIRR(cashflows: number[]): number | null {
  if (cashflows.length < 2) return null;
  if (cashflows[0] >= 0) return null;

  const MAX_ITERATIONS = 1000;
  const TOLERANCE = 1e-10;

  const npv = (rate: number): number =>
    cashflows.reduce((acc, cf, t) => acc + cf / Math.pow(1 + rate, t), 0);

  const npvDerivative = (rate: number): number =>
    cashflows.reduce((acc, cf, t) => acc + (-t * cf) / Math.pow(1 + rate, t + 1), 0);

  const seeds = [0.1, 0.01, 0.2, 0.5, -0.1];
  for (const seed of seeds) {
    let rate = seed;
    for (let i = 0; i < MAX_ITERATIONS; i++) {
      const n = npv(rate);
      if (Math.abs(n) < TOLERANCE) return rate;
      const d = npvDerivative(rate);
      if (Math.abs(d) < 1e-14) break;
      const newRate = rate - n / d;
      if (Math.abs(newRate - rate) < TOLERANCE) return newRate;
      rate = newRate;
    }
  }

  let lo = -0.99, hi = 10.0;
  if (Math.sign(npv(lo)) === Math.sign(npv(hi))) return null;
  for (let i = 0; i < MAX_ITERATIONS; i++) {
    const mid = (lo + hi) / 2;
    const nMid = npv(mid);
    if (Math.abs(nMid) < TOLERANCE || (hi - lo) / 2 < TOLERANCE) return mid;
    if (Math.sign(nMid) === Math.sign(npv(lo))) lo = mid;
    else hi = mid;
  }
  return null;
}

export function findBreakEvenYear(cashflows: number[]): number | null {
  let cumulative = 0;
  for (let i = 0; i < cashflows.length; i++) {
    cumulative += cashflows[i];
    if (cumulative >= 0) return i;
  }
  return null;
}

export function totalInvestment(cashflows: number[]): number {
  return cashflows.filter((cf) => cf < 0).reduce((sum, cf) => sum + Math.abs(cf), 0);
}

export function totalReturns(cashflows: number[]): number {
  return cashflows.filter((cf) => cf > 0).reduce((sum, cf) => sum + cf, 0);
}
