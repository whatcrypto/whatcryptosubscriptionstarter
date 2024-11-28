import { CategorizedCoin } from '../data/categoryData';

export type MarketPhase = 'btc_eth_hold' | 'layer_accumulation' | 'alt_season';

export function determineMarketPhase(): MarketPhase {
  // Force current phase to be btc_eth_hold
  return 'btc_eth_hold';
}

export function getGradeForCoin(coin: CategorizedCoin): 'buy' | 'sell' | 'hold' {
  const currentPhase = determineMarketPhase();
  const symbol = coin.symbol.toLowerCase();
  const category = coin.category.toLowerCase();

  // Check if coin is BTC or ETH
  const isBtcEth = symbol === 'btc' || symbol === 'eth';
  
  // Check if coin is Layer 1 or Layer 2
  const isLayer = category.includes('layer 1') || 
                 category.includes('layer 2') || 
                 symbol === 'sol' || 
                 symbol === 'ada' || 
                 symbol === 'avax' ||
                 symbol === 'matic' ||
                 symbol === 'arb' ||
                 symbol === 'op';

  switch (currentPhase) {
    case 'btc_eth_hold':
      return isBtcEth ? 'hold' : isLayer ? 'buy' : 'sell';
    
    case 'layer_accumulation':
      return isBtcEth ? 'sell' : isLayer ? 'buy' : 'hold';
    
    case 'alt_season':
      return isBtcEth ? 'sell' : isLayer ? 'hold' : 'buy';
    
    default:
      return 'hold';
  }
}

export function getPhaseDescription(phase: MarketPhase): string {
  switch (phase) {
    case 'btc_eth_hold':
      return 'BTC and ETH are consolidating. Capital is flowing into Layer 1s and 2s while alts are distributing.';
    case 'layer_accumulation':
      return 'Capital is flowing from BTC/ETH into Layer 1s and 2s. Alts are still in distribution.';
    case 'alt_season':
      return 'Capital is flowing from larger caps into altcoins. BTC and ETH are in distribution phase.';
    default:
      return 'Market cycle status unknown';
  }
}

export function getBadgeColor(grade: 'buy' | 'sell' | 'hold'): 'green' | 'red' | 'yellow' {
  switch (grade) {
    case 'buy':
      return 'green';
    case 'sell':
      return 'red';
    case 'hold':
      return 'yellow';
  }
}