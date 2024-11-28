import { CoinDetail } from '@/components/coins/CoinDetail';
import { PortfoliosLayout } from '@/components/portfolios/PortfoliosLayout';

export default function CoinDetailPage({ params }: { params: { id: string } }) {
  return (
    <PortfoliosLayout>
      <CoinDetail id={params.id} />
    </PortfoliosLayout>
  );
}