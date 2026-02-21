import { useState } from 'react';
import styled from 'styled-components';
import Flex from '../../../components/common/Flex';

const MOCK_MEMBERS = [
  { id: 'me', name: '내 주식', currentPrice: 12500, changePercent: 2.34 },
  { id: '1', name: '친구A 주식', currentPrice: 8300, changePercent: -0.52 },
  { id: '2', name: '친구B 주식', currentPrice: 15200, changePercent: 5.12 },
  { id: '3', name: '친구C 주식', currentPrice: 4200, changePercent: -1.22 },
];

const MOCK_EVENTS = [
  { id: '1', dateTime: '2026-02-21 14:32', type: '이벤트', title: '활동 점수 반영', priceChange: '+1,200' },
  { id: '2', dateTime: '2026-02-21 14:28', type: '채팅', title: '리액션 취소 반영', priceChange: '-500' },
  { id: '3', dateTime: '2026-02-21 14:15', type: '이벤트', title: '시간 단위 정산', priceChange: '+800' },
];

const Page = styled(Flex).attrs({ width: '100%' })`
  min-height: calc(100vh - 110px);
  flex-direction: row;
  align-items: stretch;
  gap: 18px;

  @media (max-width: 1120px) {
    flex-direction: column;
  }
`;

const Main = styled(Flex).attrs({ flex: 1, gap: 16 })`
  flex-direction: column;
  min-width: 0;
`;

const Sidebar = styled(Flex).attrs({ width: 280 })`
  flex-shrink: 0;
  flex-direction: column;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  background: #ffffff;
  overflow: hidden;

  @media (max-width: 1120px) {
    width: 100%;
    min-height: 300px;
  }
`;

const NotificationBar = styled(Flex).attrs({
  row: true,
  gap: 10,
  verticalCenter: true,
})`
  border-radius: 14px;
  padding: 12px 14px;
  background: #fff4d9;
  border: 1px solid #ffd98d;
  font-size: 14px;
  color: #92400e;
`;

const NotificationIcon = styled.span`
  font-size: 16px;
  line-height: 1;
`;

const MarketCard = styled(Flex).attrs({ gap: 14 })`
  padding: 18px;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  background: #ffffff;
`;

const AssetHeader = styled(Flex).attrs({ row: true, verticalCenter: true })`
  justify-content: space-between;
  gap: 14px;
  flex-wrap: wrap;
`;

const AssetMeta = styled(Flex).attrs({ gap: 4 })`
  min-width: 220px;
`;

const AssetTitle = styled.span`
  font-size: 22px;
  font-weight: 600;
  color: #0f172a;
`;

const AssetSubTitle = styled.span`
  font-size: 13px;
  color: #64748b;
`;

const AssetPrice = styled.span<{ $positive?: boolean }>`
  font-size: 34px;
  font-weight: 700;
  color: ${({ $positive }) => ($positive ? '#dc2626' : '#2563eb')};
`;

const AssetChange = styled.span<{ $positive?: boolean }>`
  font-size: 14px;
  color: ${({ $positive }) => ($positive ? '#dc2626' : '#2563eb')};
`;

const StatGrid = styled(Flex).attrs({ row: true, gap: 12 })`
  flex-wrap: wrap;
`;

const StatItem = styled(Flex).attrs({ gap: 4 })`
  min-width: 132px;
  padding: 12px;
  border-radius: 12px;
  border: 1px solid #edf2f8;
  background: #f8fbff;
`;

const StatLabel = styled.span`
  font-size: 12px;
  color: #64748b;
`;

const StatValue = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: #0f172a;
`;

const Tabs = styled(Flex).attrs({ row: true, gap: 0 })`
  border-bottom: 1px solid #edf2f8;
  padding: 0 4px;
`;

const Tab = styled.button<{ $active?: boolean }>`
  padding: 12px 16px;
  font-size: 14px;
  font-weight: 600;
  color: ${({ $active }) => ($active ? '#2563eb' : '#64748b')};
  background: none;
  border: none;
  border-bottom: 2px solid ${({ $active }) => ($active ? '#2563eb' : 'transparent')};
  cursor: pointer;
  margin-bottom: -1px;

  &:hover {
    color: ${({ $active }) => ($active ? '#2563eb' : '#334155')};
  }
`;

const ChartSection = styled(Flex).attrs({ flex: 1, gap: 12 })`
  min-height: 360px;
  padding: 0;
  background: #fff;
`;

const ChartPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  min-height: 300px;
  background: linear-gradient(180deg, #f8fbff 0%, #f1f6ff 100%);
  border: 1px solid #dfe9f8;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7b93;
  font-size: 14px;
`;

const OrderSection = styled(Flex).attrs({ row: true, gap: 24 })`
  padding: 0;
  background: #fff;

  @media (max-width: 980px) {
    flex-direction: column;
  }
`;

const OrderBlock = styled(Flex).attrs({ flex: 1 })`
  min-width: 260px;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  background: #fff;
  overflow: hidden;
`;

const OrderHeader = styled.div<{ $buy?: boolean }>`
  padding: 13px 16px;
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  background: ${({ $buy }) => ($buy ? '#ef4444' : '#2563eb')};
`;

const OrderTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;

  td {
    padding: 12px 16px;
    border-bottom: 1px solid #f1f5f9;
    vertical-align: middle;
  }
  td:first-child {
    color: #64748b;
    width: 100px;
  }
  tr:last-child td {
    border-bottom: none;
  }
`;

const OrderInput = styled.input`
  width: 100%;
  height: 36px;
  padding: 0 12px;
  font-size: 14px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #2563eb;
  }
`;

const OrderButton = styled.button<{ $buy?: boolean }>`
  width: 100%;
  margin-top: 10px;
  padding: 11px;
  font-size: 15px;
  font-weight: 600;
  color: #fff;
  background: ${({ $buy }) => ($buy ? '#ef4444' : '#2563eb')};
  border: none;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`;

const EventsSection = styled(Flex)`
  padding: 0;
  background: #fff;
`;

const EventsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;

  th,
  td {
    padding: 12px 16px;
    text-align: left;
    border-bottom: 1px solid #e5e7eb;
  }
  th {
    font-weight: 600;
    color: #64748b;
    background: #f8fbff;
  }
`;

const SidebarHeader = styled.div`
  padding: 12px 16px;
  font-size: 13px;
  font-weight: 600;
  color: #64748b;
  border-bottom: 1px solid #edf2f8;
  background: #f8fbff;
`;

const SearchInput = styled.input`
  margin: 8px 12px;
  padding: 8px 12px;
  font-size: 13px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  box-sizing: border-box;

  &::placeholder {
    color: #94a3b8;
  }
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

type TabId = 'quote' | 'events';

function ExchangePage() {
  const [activeTab, setActiveTab] = useState<TabId>('quote');
  const [selectedMemberId, setSelectedMemberId] = useState<string>('me');
  const [buyQuantity, setBuyQuantity] = useState('');
  const [sellQuantity, setSellQuantity] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');

  const selectedMember = MOCK_MEMBERS.find((m) => m.id === selectedMemberId) ?? MOCK_MEMBERS[0];
  const filteredMembers = MOCK_MEMBERS.filter(
    (m) =>
      !searchKeyword.trim() ||
      m.name.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  const formatPrice = (n: number) => n.toLocaleString('ko-KR');
  const formatChange = (p: number) => `${p >= 0 ? '+' : ''}${p.toFixed(2)}%`;
  const isPositive = selectedMember.changePercent >= 0;

  return (
    <Page>
      <Main>
        <NotificationBar>
          <NotificationIcon aria-hidden>🔔</NotificationIcon>
          <span>이번 주 꼴등 패널티 후보 알림이 2건 있습니다.</span>
        </NotificationBar>

        <MarketCard>
          <AssetHeader>
            <AssetMeta>
              <AssetTitle>{selectedMember.name} · KRW</AssetTitle>
              <AssetSubTitle>최근 체결가 기준</AssetSubTitle>
            </AssetMeta>
            <Flex gap={2}>
              <AssetPrice $positive={isPositive}>{formatPrice(selectedMember.currentPrice)} KRW</AssetPrice>
              <AssetChange $positive={isPositive}>
                {formatChange(selectedMember.changePercent)} {isPositive ? '▲' : '▼'}
              </AssetChange>
            </Flex>
          </AssetHeader>

          <StatGrid>
            <StatItem>
              <StatLabel>고가</StatLabel>
              <StatValue>{formatPrice(selectedMember.currentPrice + 480)}</StatValue>
            </StatItem>
            <StatItem>
              <StatLabel>저가</StatLabel>
              <StatValue>{formatPrice(selectedMember.currentPrice - 320)}</StatValue>
            </StatItem>
            <StatItem>
              <StatLabel>거래량</StatLabel>
              <StatValue>{formatPrice(12472)}</StatValue>
            </StatItem>
            <StatItem>
              <StatLabel>관심도 점수</StatLabel>
              <StatValue>{(selectedMember.changePercent * 10 + 70).toFixed(1)}</StatValue>
            </StatItem>
          </StatGrid>

          <Tabs>
            <Tab $active={activeTab === 'quote'} onClick={() => setActiveTab('quote')}>
              시세
            </Tab>
            <Tab $active={activeTab === 'events'} onClick={() => setActiveTab('events')}>
              이벤트 발생
            </Tab>
          </Tabs>

          {activeTab === 'quote' && (
            <>
              <ChartSection>
                <ChartPlaceholder>
                  {selectedMemberId === 'me' ? '내 주식 차트' : `${selectedMember.name} 차트`} · 실제 시세 연동 예정
                </ChartPlaceholder>
              </ChartSection>

              <OrderSection>
                <OrderBlock>
                  <OrderHeader $buy>매수</OrderHeader>
                  <OrderTable>
                    <tbody>
                      <tr>
                        <td>주문 가능</td>
                        <td>{formatPrice(selectedMember.currentPrice * 1000)} KRW</td>
                      </tr>
                      <tr>
                        <td>주문수량</td>
                        <td>
                          <OrderInput
                            type="text"
                            placeholder="수량 입력"
                            value={buyQuantity}
                            onChange={(event) => setBuyQuantity(event.target.value)}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>주문 총액</td>
                        <td>
                          {buyQuantity
                            ? formatPrice(selectedMember.currentPrice * (Number(buyQuantity) || 0)) + ' KRW'
                            : '-'}
                        </td>
                      </tr>
                    </tbody>
                  </OrderTable>
                  <div style={{ padding: '0 16px 16px' }}>
                    <OrderButton $buy>매수</OrderButton>
                  </div>
                </OrderBlock>

                <OrderBlock>
                  <OrderHeader $buy={false}>매도</OrderHeader>
                  <OrderTable>
                    <tbody>
                      <tr>
                        <td>주문 가능</td>
                        <td>{formatPrice(selectedMember.currentPrice * 500)} KRW</td>
                      </tr>
                      <tr>
                        <td>주문수량</td>
                        <td>
                          <OrderInput
                            type="text"
                            placeholder="수량 입력"
                            value={sellQuantity}
                            onChange={(event) => setSellQuantity(event.target.value)}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>주문 총액</td>
                        <td>
                          {sellQuantity
                            ? formatPrice(selectedMember.currentPrice * (Number(sellQuantity) || 0)) + ' KRW'
                            : '-'}
                        </td>
                      </tr>
                    </tbody>
                  </OrderTable>
                  <div style={{ padding: '0 16px 16px' }}>
                    <OrderButton $buy={false}>매도</OrderButton>
                  </div>
                </OrderBlock>
              </OrderSection>
            </>
          )}

          {activeTab === 'events' && (
            <EventsSection>
              <EventsTable>
                <thead>
                  <tr>
                    <th>거래 일시</th>
                    <th>타입</th>
                    <th>내용</th>
                    <th>변동가</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_EVENTS.map((event) => (
                    <tr key={event.id}>
                      <td>{event.dateTime}</td>
                      <td>{event.type}</td>
                      <td>{event.title}</td>
                      <td style={{ color: event.priceChange.startsWith('+') ? '#dc2626' : '#2563eb' }}>
                        {event.priceChange}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </EventsTable>
            </EventsSection>
          )}
        </MarketCard>
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
          {filteredMembers.map((m) => (
            <MemberRow
              key={m.id}
              $selected={selectedMemberId === m.id}
              onClick={() => setSelectedMemberId(m.id)}
            >
              <MemberName>{m.name}</MemberName>
              <MemberPrice>{formatPrice(m.currentPrice)}</MemberPrice>
              <MemberChange $up={m.changePercent > 0 ? true : m.changePercent < 0 ? false : undefined}>
                {formatChange(m.changePercent)}
              </MemberChange>
            </MemberRow>
          ))}
        </MemberList>
      </Sidebar>
    </Page>
  );
}

export default ExchangePage;
