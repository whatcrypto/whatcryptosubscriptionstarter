export interface Score {
  score: number;
  trend: 'up' | 'down' | 'stable';
  description: string;
  [key: string]: number | string;
}