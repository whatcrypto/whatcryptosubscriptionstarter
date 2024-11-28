import { PortfolioDetail } from '@/components/portfolios/PortfolioDetail';
import { PortfoliosLayout } from '@/components/portfolios/PortfoliosLayout';

export default function PortfolioDetailPage({ params }: { params: { id: string } }) {
  return (
    <PortfoliosLayout>
      <PortfolioDetail id={params.id} />
    </PortfoliosLayout>
  );
}