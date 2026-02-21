import { createContext, useContext } from 'react';
import type { TabId, ExchangeMember, ExchangeEvent } from './constants';

export interface ExchangePageContextValue {
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
  selectedMemberId: string;
  setSelectedMemberId: (id: string) => void;
  searchKeyword: string;
  setSearchKeyword: (v: string) => void;
  selectedMember: ExchangeMember;
  members: ExchangeMember[];
  filteredMembers: ExchangeMember[];
  events: ExchangeEvent[];
  formatPrice: (n: number) => string;
  formatChange: (p: number) => string;
}

export const ExchangePageContext = createContext<ExchangePageContextValue | null>(null);

export function useExchangePage() {
  const ctx = useContext(ExchangePageContext);
  if (!ctx) throw new Error('useExchangePage must be used within ExchangePageProvider');
  return ctx;
}
