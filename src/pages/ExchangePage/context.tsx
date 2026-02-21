import { useMemo, useState } from 'react';
import type { TabId } from './constants';
import { MOCK_MEMBERS, MOCK_EVENTS } from './constants';
import { ExchangePageContext } from './exchangePageContext';

export function ExchangePageProvider({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState<TabId>('quote');
  const [selectedMemberId, setSelectedMemberId] = useState<string>('me');
  const [searchKeyword, setSearchKeyword] = useState('');

  const selectedMember = useMemo(
    () => MOCK_MEMBERS.find((m) => m.id === selectedMemberId) ?? MOCK_MEMBERS[0],
    [selectedMemberId]
  );

  const filteredMembers = useMemo(
    () =>
      MOCK_MEMBERS.filter(
        (m) =>
          !searchKeyword.trim() ||
          m.name.toLowerCase().includes(searchKeyword.toLowerCase())
      ),
    [searchKeyword]
  );

  const formatPrice = (n: number) => n.toLocaleString('ko-KR');
  const formatChange = (p: number) => `${p >= 0 ? '+' : ''}${p.toFixed(2)}%`;

  const value = useMemo(
    () => ({
      activeTab,
      setActiveTab,
      selectedMemberId,
      setSelectedMemberId,
      searchKeyword,
      setSearchKeyword,
      selectedMember,
      members: MOCK_MEMBERS,
      filteredMembers,
      events: MOCK_EVENTS,
      formatPrice,
      formatChange,
    }),
    [
      activeTab,
      selectedMemberId,
      searchKeyword,
      selectedMember,
      filteredMembers,
    ]
  );

  return (
    <ExchangePageContext.Provider value={value}>
      {children}
    </ExchangePageContext.Provider>
  );
}
