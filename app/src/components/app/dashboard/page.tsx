import { determineMarketPhase } from '@/utils/marketCycle';

export default function DashboardPage() {
  const currentPhase = determineMarketPhase()
  
  const getCycleStatus = (type: 'btc_eth' | 'layers' | 'alts') => {
    switch (currentPhase) {
      case 'btc_eth_hold':
        return {
          btc_eth: { trend: 'neutral', label: 'CONSOLIDATION' },
          layers: { trend: 'up', label: 'ACCUMULATION' },
          alts: { trend: 'down', label: 'DISTRIBUTION' }
        }[type]
      // ... rest of the switch cases
    }
  }

  // ... rest of your component logic

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-6">
        {/* Your existing JSX */}
      </div>
    </div>
  )
} 