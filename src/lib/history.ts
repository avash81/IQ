export interface TestResult {
  id: string;
  date: string;
  iq: number;
  percentile: number;
  category: string;
  mode: string;
  correct: number;
  total: number;
  domainScores: Record<string, number>;
  theta?: number;
  ci?: { low: number; high: number };
}

const STORAGE_KEY = 'iqtestpro_history';

export function saveResult(result: TestResult): void {
  const history = getHistory();
  history.unshift(result);
  // Keep only last 10 results
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(0, 10)));
}

export function getHistory(): TestResult[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function clearHistory(): void {
  localStorage.removeItem(STORAGE_KEY);
}
