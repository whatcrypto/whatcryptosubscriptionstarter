import React from 'react';
import { determineMarketPhase, getPhaseDescription } from '../utils/marketCycle';
import { TrendingUp, TrendingDown, Minus, Bitcoin, Network, Layers, LineChart, AlertCircle, Newspaper, BarChart } from 'lucide-react';
import  Link from 'next/link';
import MoneyFlowCycle from '../components/portfolio/MoneyFlowCycle';

const Dashboard: React.FC = () => {
  const currentPhase = determineMarketPhase();
  
  const getCycleStatus = (type: 'btc_eth' | 'layers' | 'alts') => {
    switch (currentPhase) {
      case 'btc_eth_hold':
        return {
          btc_eth: { trend: 'neutral', label: 'CONSOLIDATION' },
          layers: { trend: 'up', label: 'ACCUMULATION' },
          alts: { trend: 'down', label: 'DISTRIBUTION' }
        }[type];
      case 'layer_accumulation':
        return {
          btc_eth: { trend: 'down', label: 'DISTRIBUTION' },
          layers: { trend: 'up', label: 'ACCUMULATION' },
          alts: { trend: 'neutral', label: 'FLAT' }
        }[type];
      case 'alt_season':
        return {
          btc_eth: { trend: 'down', label: 'DISTRIBUTION' },
          layers: { trend: 'neutral', label: 'FLAT' },
          alts: { trend: 'up', label: 'ACCUMULATION' }
        }[type];
      default:
        return { trend: 'neutral', label: 'UNKNOWN' };
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-6 w-6 text-green-400" />;
      case 'down':
        return <TrendingDown className="h-6 w-6 text-red-400" />;
      default:
        return <Minus className="h-6 w-6 text-yellow-400" />;
    }
  };

  const MarketCycleCard = ({ 
    title, 
    type, 
    icon: Icon,
    description 
  }: { 
    title: string; 
    type: 'btc_eth' | 'layers' | 'alts';
    icon: any;
    description: string;
  }) => {
    const status = getCycleStatus(type);
    
    return (
      <div className="bg-[#151C2C] rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-slate-800 flex items-center justify-center">
              <Icon className="h-6 w-6 text-blue-400" />
            </div>
            <h2 className="text-xl font-bold text-white">{title}</h2>
          </div>
          {getTrendIcon(status.trend)}
        </div>
        
        <div className="mb-4">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            status.trend === 'up' ? 'bg-green-500/10 text-green-400' :
            status.trend === 'down' ? 'bg-red-500/10 text-red-400' :
            'bg-yellow-500/10 text-yellow-400'
          }`}>
            {status.label}
          </span>
        </div>

        <p className="text-slate-400">{description}</p>
      </div>
    );
  };

  const quickLinks = [
    { to: '/leaderboard', icon: LineChart, label: 'leaderboard', description: 'Find current opportunities' },
    { to: '/actions', icon: AlertCircle, label: 'Actions', description: 'Current market actions to take' },
    { to: '/insights', icon: BarChart, label: 'Insights', description: 'Market analysis and trends' },
    { to: '/news', icon: Newspaper, label: 'News', description: 'Latest crypto news and updates' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Market Cycle</h1>
        <p className="text-slate-400 mt-1">{getPhaseDescription(currentPhase)}</p>
      </div>

      <MoneyFlowCycle />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MarketCycleCard
          title="BTC & ETH"
          type="btc_eth"
          icon={Bitcoin}
          description="Major market movers showing overall market direction and sentiment."
        />
        
        <MarketCycleCard
          title="Layer 1 & 2"
          type="layers"
          icon={Layers}
          description="Infrastructure protocols and scaling solutions leading innovation."
        />
        
        <MarketCycleCard
          title="Altcoins"
          type="alts"
          icon={Network}
          description="Smaller cap tokens and emerging projects in various sectors."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {quickLinks.map(link => (
          <Link href
            key={link.to}
            hrefLang='en'
            className="bg-[#151C2C] p-4 rounded-lg hover:bg-[#1A2235] transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center">
                <link.icon className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <h3 className="font-medium text-white">{link.label}</h3>
                <p className="text-sm text-slate-400">{link.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;