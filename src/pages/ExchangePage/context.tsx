import { useEffect, useMemo, useState } from 'react';
import type { TabId, ExchangeMember } from './constants';
import { MOCK_EVENTS } from './constants';
import { getStocks } from '../../api/stock';
import type { StockListItem } from '../../api/stock';
import { ExchangePageContext } from './exchangePageContext';

function mapStockToMember(item: StockListItem): ExchangeMember {
  return {
    id: String(item.user_id),
    name: item.name,
    currentPrice: parseFloat(item.current_price),
    changePercent: item.change_rate,
  };
}

const FALLBACK_MEMBER: ExchangeMember = {
  id: '',
  name: '-',
  currentPrice: 0,
  changePercent: 0,
};

export function ExchangePageProvider({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState<TabId>('quote');
  const [selectedMemberId, setSelectedMemberId] = useState<string>('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [members, setMembers] = useState<ExchangeMember[]>([]);
  const [membersLoading, setMembersLoading] = useState(true);
  const [membersError, setMembersError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchStocks() {
      setMembersLoading(true);
      setMembersError(null);
      try {
        const list = await getStocks();
        if (cancelled) return;
        const mapped = list.map(mapStockToMember);
        setMembers(mapped);
        if (mapped.length > 0) {
          setSelectedMemberId((prev) => prev || mapped[0].id);
        }
      } catch (e) {
        if (!cancelled) {
          setMembersError(e instanceof Error ? e.message : '주식 목록을 불러오지 못했습니다.');
        }
      } finally {
        if (!cancelled) setMembersLoading(false);
      }
    }

    fetchStocks();
    return () => {
      cancelled = true;
    };
  }, []);

  const selectedMember = useMemo(() => {
    const found = members.find((m) => m.id === selectedMemberId);
    if (found) return found;
    if (members.length > 0) return members[0];
    return FALLBACK_MEMBER;
  }, [members, selectedMemberId]);

  const filteredMembers = useMemo(
    () =>
      members.filter(
        (m) =>
          !searchKeyword.trim() ||
          m.name.toLowerCase().includes(searchKeyword.toLowerCase())
      ),
    [members, searchKeyword]
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
      members,
      filteredMembers,
      membersLoading,
      membersError,
      events: MOCK_EVENTS,
      formatPrice,
      formatChange,
    }),
    [
      activeTab,
      selectedMemberId,
      searchKeyword,
      selectedMember,
      members,
      filteredMembers,
      membersLoading,
      membersError,
    ]
  );

  return (
    <ExchangePageContext.Provider value={value}>
      {children}
    </ExchangePageContext.Provider>
  );
}
