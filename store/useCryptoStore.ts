import { create } from 'zustand';
import { fetchCryptoData, CryptoData } from '../utils/fetchCrypto';

export type SortOrder = 'price_desc' | 'price_asc' | 'market_cap_desc' | 'market_cap_asc' | 'name_asc' | 'name_desc';

interface CryptoStore {
  cryptoList: CryptoData[];
  loading: boolean;
  error: string | null;
  sortOrder: SortOrder;
  setSortOrder: (order: SortOrder) => void;
  fetchData: () => Promise<void>;
  getSortedCryptoList: () => CryptoData[];
}

export const useCryptoStore = create<CryptoStore>((set, get) => ({
  cryptoList: [],
  loading: false,
  error: null,
  sortOrder: 'market_cap_desc' as SortOrder,
  
  setSortOrder: (order) => {
    console.log('Setting sort order to:', order);
    set({ sortOrder: order });
  },
  
  fetchData: async () => {
    try {
      set({ loading: true, error: null });
      const data = await fetchCryptoData();
      set({ cryptoList: data, loading: false });
    } catch (error) {
      console.error('Error in store while fetching crypto data:', error);
      set({ 
        error: error instanceof Error ? error.message : 'An unknown error occurred',
        loading: false 
      });
    }
  },
  
  getSortedCryptoList: () => {
    const { cryptoList, sortOrder } = get();
    console.log('Getting sorted list with sort order:', sortOrder);
    let sortedList = [...cryptoList];
    
    switch (sortOrder) {
      case 'price_desc':
        sortedList.sort((a, b) => b.current_price - a.current_price);
        break;
      case 'price_asc':
        sortedList.sort((a, b) => a.current_price - b.current_price);
        break;
      case 'market_cap_desc':
        sortedList.sort((a, b) => b.market_cap - a.market_cap);
        break;
      case 'market_cap_asc':
        sortedList.sort((a, b) => a.market_cap - b.market_cap);
        break;
      case 'name_asc':
        sortedList.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name_desc':
        sortedList.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        // Default to market cap (high to low) if no valid sort order
        sortedList.sort((a, b) => b.market_cap - a.market_cap);
    }
    
    return sortedList;
  }
})); 