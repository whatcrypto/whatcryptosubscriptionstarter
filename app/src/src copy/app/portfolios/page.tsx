import { PortfolioList } from '@/components/portfolios/PortfolioList';
import { PortfoliosLayout } from '@/components/portfolios/PortfoliosLayout';

export default function PortfoliosPage() {
  return (
    <PortfoliosLayout>
      <PortfolioList />
    </PortfoliosLayout>
  );
}