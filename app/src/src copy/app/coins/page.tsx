import { CoinList } from '@/components/coins/CoinList';
import { PortfoliosLayout } from '@/components/portfolios/PortfoliosLayout';

export default function CoinsPage() {
  return (
    <PortfoliosLayout>
      <CoinList />
    </PortfoliosLayout>
  );
}