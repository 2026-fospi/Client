import styled from 'styled-components';
import Flex from '../../../components/common/Flex';
import { ExchangePageProvider } from './context';
import { useExchangePage } from './exchangePageContext';
import QuoteTab from './QuoteTab';
import EventsTab from './EventsTab';

const Page = styled(Flex).attrs({ width: '100%' })`
  min-height: calc(100vh - 120px);
  flex-direction: row;
  align-items: stretch;
`;

const Main = styled(Flex).attrs({ flex: 1 })`
  flex-direction: column;
  min-width: 0;
`;

const Sidebar = styled(Flex).attrs({ width: 280 })`
  flex-shrink: 0;
  flex-direction: column;
  border-left: 1px solid #e5e7eb;
  background: #fff;
`;

const NotificationBar = styled(Flex).attrs({
  row: true,
  gap: 8,
  verticalCenter: true,
})`
  padding: 10px 16px;
  background: #fef3c7;
  border-bottom: 1px solid #fcd34d;
  font-size: 14px;
  color: #92400e;
`;

const NotificationIcon = styled.span`
  font-size: 18px;
  line-height: 1;
`;

const AssetHeader = styled(Flex).attrs({ row: true, verticalCenter: true })`
  padding: 16px 20px;
  border-bottom: 1px solid #e5e7eb;
  justify-content: space-between;
  gap: 14px;
  flex-wrap: wrap;
`;

const AssetTitle = styled.span`
  font-size: 20px;
  font-weight: 600;
  color: #111;
`;

const AssetPrice = styled.span<{ $up?: boolean }>`
  font-size: 24px;
  font-weight: 700;
  color: ${({ $up }) => ($up === true ? '#ef4444' : $up === false ? '#2563eb' : '#111')};
`;

const AssetChange = styled.span<{ $up?: boolean }>`
  font-size: 14px;
  color: ${({ $up }) => ($up === true ? '#ef4444' : $up === false ? '#2563eb' : '#64748b')};
`;

const Tabs = styled(Flex).attrs({ row: true, gap: 0 })`
  border-bottom: 1px solid #e5e7eb;
  padding: 0 20px;
`;

const Tab = styled.button<{ $active?: boolean }>`
  padding: 14px 20px;
  font-size: 14px;
  font-weight: 500;
  color: ${({ $active }) => ($active ? '#2563eb' : '#64748b')};
  background: none;
  border: none;
  cursor: pointer;
  margin-bottom: -1px;

  &:hover {
    color: ${({ $active }) => ($active ? '#2563eb' : '#334155')};
  }
`;

const SidebarHeader = styled.div`
  padding: 12px 16px;
  font-size: 13px;
  font-weight: 600;
  color: #64748b;
  border-bottom: 1px solid #e5e7eb;
  background: #f8fafc;
`;

const SearchInput = styled.input`
  margin: 8px 12px;
  padding: 8px 12px;
  font-size: 13px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  box-sizing: border-box;
  background-color: #fff;
  color: #747474;
`;

const MemberList = styled(Flex)`
  flex: 1;
  overflow-y: auto;
`;

const MemberRow = styled(Flex).attrs({
  row: true,
  verticalCenter: true,
})<{ $selected?: boolean }>`
  padding: 12px 16px;
  cursor: pointer;
  border-bottom: 1px solid #f1f5f9;
  background: ${({ $selected }) => ($selected ? '#eff6ff' : 'transparent')};

  &:hover {
    background: ${({ $selected }) => ($selected ? '#eff6ff' : '#f8fafc')};
  }
`;

const MemberName = styled.span`
  flex: 1;
  font-size: 14px;
  font-weight: 500;
  color: #111;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const MemberPrice = styled.span`
  font-size: 13px;
  color: #334155;
  margin-right: 8px;
`;

const MemberChange = styled.span<{ $up?: boolean }>`
  font-size: 13px;
  font-weight: 500;
  color: ${({ $up }) => ($up === true ? '#ef4444' : $up === false ? '#2563eb' : '#64748b')};
`;

function ExchangePageContent() {
  const {
    activeTab,
    setActiveTab,
    selectedMemberId,
    setSelectedMemberId,
    searchKeyword,
    setSearchKeyword,
    selectedMember,
    filteredMembers,
    formatPrice,
    formatChange,
  } = useExchangePage();

  return (
    <Page>
      <Main>
        <NotificationBar>
          <NotificationIcon aria-hidden>🔔</NotificationIcon>
          <span>패널티 및 공지 알림이 여기에 표시됩니다.</span>
        </NotificationBar>

        <AssetHeader>
          <AssetTitle>{selectedMember.name} · KRW</AssetTitle>
          <AssetPrice
            $up={
              selectedMember.changePercent > 0 ? false : selectedMember.changePercent < 0 ? true : undefined
            }
          >
            {formatPrice(selectedMember.currentPrice)} KRW
          </AssetPrice>
          <AssetChange
            $up={
              selectedMember.changePercent > 0 ? true : selectedMember.changePercent < 0 ? false : undefined
            }
          >
            {formatChange(selectedMember.changePercent)} {selectedMember.changePercent >= 0 ? '▲' : '▼'}
          </AssetChange>
        </AssetHeader>

        <Tabs>
          <Tab $active={activeTab === 'quote'} onClick={() => setActiveTab('quote')}>
            시세
          </Tab>
          <Tab $active={activeTab === 'events'} onClick={() => setActiveTab('events')}>
            이벤트 발생
          </Tab>
        </Tabs>

        {activeTab === 'quote' && <QuoteTab />}
        {activeTab === 'events' && <EventsTab />}
      </Main>

      <Sidebar>
        <SidebarHeader>멤버 주식</SidebarHeader>
        <SearchInput
          type="text"
          placeholder="이름 검색"
          value={searchKeyword}
          onChange={(event) => setSearchKeyword(event.target.value)}
        />
        <Flex row style={{ padding: '8px 16px', fontSize: 12, color: '#94a3b8' }}>
          <span style={{ flex: 1 }}>이름</span>
          <span style={{ width: 56, textAlign: 'right' }}>현재가</span>
          <span style={{ width: 52, textAlign: 'right' }}>전일대비</span>
        </Flex>
        <MemberList>
          {filteredMembers.map((member) => (
            <MemberRow
              key={member.id}
              $selected={selectedMemberId === member.id}
              onClick={() => setSelectedMemberId(member.id)}
            >
              <MemberName>{member.name}</MemberName>
              <MemberPrice>{formatPrice(member.currentPrice)}</MemberPrice>
              <MemberChange
                $up={member.changePercent > 0 ? true : member.changePercent < 0 ? false : undefined}
              >
                {formatChange(member.changePercent)}
              </MemberChange>
            </MemberRow>
          ))}
        </MemberList>
      </Sidebar>
    </Page>
  );
}

export default function ExchangePage() {
  return (
    <ExchangePageProvider>
      <ExchangePageContent />
    </ExchangePageProvider>
  );
}
