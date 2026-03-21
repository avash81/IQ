export interface IRTQuestion {
  id: number;
  text: string;
  options: { id: string; text: string }[];
  correctOptionId: string;
  explanation: string;
  category: string;
  domain: string;
  difficulty: number;   // b-parameter: -3.0 to +3.0 (z-score scale)
  discrimination: number; // a-parameter: 0.5 to 2.5
  sequence?: string;
}

export function irtProbability(theta: number, b: number, a: number): number {
  // 2PL IRT model: P(correct) = 1 / (1 + e^(-a*(theta-b)))
  return 1 / (1 + Math.exp(-a * (theta - b)));
}

export function updateTheta(
  theta: number,
  correct: boolean,
  b: number,
  a: number
): number {
  // EAP (Expected A Posteriori) update — simplified Newton-Raphson
  const p = irtProbability(theta, b, a);
  const q = 1 - p;
  const info = a * a * p * q; // Fisher Information
  const residual = (correct ? 1 : 0) - p;
  // Gradient step with learning rate based on information
  const step = residual / (info + 0.1); // 0.1 = regularization
  return Math.max(-4, Math.min(4, theta + step * a));
}

export function selectNextQuestion<T extends { id: number; difficulty: number; domain: string }>(
  theta: number,
  usedIds: Set<number>,
  bank: T[],
  domain?: string
): T | null {
  // Select question with difficulty closest to current theta
  // Maximum information criterion: |b - theta| minimized
  const available = bank.filter(q =>
    !usedIds.has(q.id) &&
    (!domain || q.domain === domain)
  );
  if (!available.length) return null;

  return available.reduce((best, q) => {
    const bestScore = Math.abs(best.difficulty - theta);
    const qScore = Math.abs(q.difficulty - theta);
    return qScore < bestScore ? q : best;
  });
}

export function thetaToIQ(theta: number): number {
  return Math.max(62, Math.min(152, Math.round(100 + 15 * theta)));
}

export function computeConfidenceInterval(
  theta: number,
  answeredCount: number
): { low: number; high: number } {
  // SE decreases as more questions answered
  const se = 1.5 / Math.sqrt(answeredCount + 1);
  return {
    low:  thetaToIQ(theta - 1.96 * se),
    high: thetaToIQ(theta + 1.96 * se),
  };
}
