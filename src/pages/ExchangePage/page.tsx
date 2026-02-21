import { useState } from 'react';
import styled from 'styled-components';
import Flex from '../../../components/common/Flex';

// Mock: 디스코드 방 멤버 주식 목록 (연동 후 API로 대체)
const MOCK_MEMBERS = [
  { id: 'me', name: '내 주식', currentPrice: 12500, changePercent: 2.34 },
  { id: '1', name: '친구A 주식', currentPrice: 8300, changePercent: -0.52 },
  { id: '2', name: '친구B 주식', currentPrice: 15200, changePercent: 5.12 },
  { id: '3', name: '친구C 주식', currentPrice: 4200, changePercent: -1.22 },
];

// Mock: 이벤트 발생 목록
const MOCK_EVENTS = [
  { id: '1', dateTime: '2026-02-21 14:32', type: '이벤트', priceChange: '+1,200' },
  { id: '2', dateTime: '2026-02-21 14:28', type: '채팅', priceChange: '-500' },
  { id: '3', dateTime: '2026-02-21 14:15', type: '이벤트', priceChange: '+800' },
];

// ========== Layout ==========
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
  background: #fafafa;
`;

// ========== 상단 패널티 알림 ==========
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

// ========== 자산 제목 (선택된 멤버 주식) ==========
const AssetHeader = styled(Flex).attrs({ gap: 4 })`
  padding: 16px 20px;
  border-bottom: 1px solid #e5e7eb;
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

// ========== 탭 (시세 | 이벤트 발생) ==========
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
  border-bottom: 2px solid ${({ $active }) => ($active ? '#2563eb' : 'transparent')};
  cursor: pointer;
  margin-bottom: -1px;

  &:hover {
    color: ${({ $active }) => ($active ? '#2563eb' : '#334155')};
  }
`;

// ========== 차트 영역 ==========
const ChartSection = styled(Flex).attrs({ flex: 1 })`
  min-height: 360px;
  padding: 16px 20px;
  background: #fff;
  border-bottom: 1px solid #e5e7eb;
`;

const ChartPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  min-height: 320px;
  background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  font-size: 14px;
`;

// ========== 차트 하단: 매수/매도 ==========
const OrderSection = styled(Flex).attrs({ row: true, gap: 24 })`
  padding: 20px;
  background: #fff;
  border-bottom: 1px solid #e5e7eb;
`;

const OrderBlock = styled(Flex).attrs({ flex: 1 })`
  max-width: 320px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
`;

const OrderHeader = styled.div<{ $buy?: boolean }>`
  padding: 12px 16px;
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
  padding: 8px 12px;
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
  margin-top: 12px;
  padding: 12px;
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

// ========== 이벤트 발생 탭 ==========
const EventsSection = styled(Flex)`
  padding: 20px;
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
    background: #f8fafc;
  }
`;

// ========== 멤버 주식 사이드바 ==========
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

// ========== Component ==========
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

  return (
    <Page>
      <Main>
        {/* 상단 패널티 알림 */}
        <NotificationBar>
          <NotificationIcon aria-hidden>🔔</NotificationIcon>
          <span>패널티 및 공지 알림이 여기에 표시됩니다.</span>
        </NotificationBar>

        {/* 선택된 자산 헤더 */}
        <AssetHeader>
          <AssetTitle>{selectedMember.name} · KRW</AssetTitle>
          <AssetPrice $up={selectedMember.changePercent > 0 ? false : selectedMember.changePercent < 0 ? true : undefined}>
            {formatPrice(selectedMember.currentPrice)} KRW
          </AssetPrice>
          <AssetChange $up={selectedMember.changePercent > 0 ? true : selectedMember.changePercent < 0 ? false : undefined}>
            {formatChange(selectedMember.changePercent)} {selectedMember.changePercent >= 0 ? '▲' : '▼'}
          </AssetChange>
        </AssetHeader>

        {/* 탭: 시세 | 이벤트 발생 */}
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
            {/* 차트 (기본: 내 차트) */}
            <ChartSection>
              <ChartPlaceholder>
                {selectedMemberId === 'me' ? '내 차트' : `${selectedMember.name} 차트`} · 연동 후 실제 차트가 표시됩니다.
              </ChartPlaceholder>
            </ChartSection>

            {/* 매수 / 매도 */}
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
                          onChange={(e) => setBuyQuantity(e.target.value)}
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
                          onChange={(e) => setSellQuantity(e.target.value)}
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
                  <th>변동가</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_EVENTS.map((ev) => (
                  <tr key={ev.id}>
                    <td>{ev.dateTime}</td>
                    <td>{ev.type}</td>
                    <td style={{ color: ev.priceChange.startsWith('+') ? '#ef4444' : '#2563eb' }}>
                      {ev.priceChange}
                    </td>
                  </tr>
                ))}
              </tbody>
            </EventsTable>
          </EventsSection>
        )}
      </Main>

      {/* 멤버 주식 선택 사이드바 */}
      <Sidebar>
        <SidebarHeader>멤버 주식</SidebarHeader>
        <SearchInput
          type="text"
          placeholder="이름 검색"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
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
