import {useState} from 'react';
import styled from 'styled-components';
import Flex from '../../../components/common/Flex';

const MOCK_MEMBERS = [
    {id: 'me', name: '내 주식', currentPrice: 12500, changePercent: 2.34},
    {id: '1', name: '친구A 주식', currentPrice: 8300, changePercent: -0.52},
    {id: '2', name: '친구B 주식', currentPrice: 15200, changePercent: 5.12},
    {id: '3', name: '친구C 주식', currentPrice: 4200, changePercent: -1.22},
];

const MOCK_EVENTS = [
    {id: '1', dateTime: '2026-02-21 14:32', type: '이벤트', priceChange: '+1,200'},
    {id: '2', dateTime: '2026-02-21 14:28', type: '채팅', priceChange: '-500'},
    {id: '3', dateTime: '2026-02-21 14:15', type: '이벤트', priceChange: '+800'},
];

// ========== Layout ==========
const Page = styled(Flex).attrs({width: '100%'})`
    min-height: calc(100vh - 120px);
    flex-direction: row;
    align-items: stretch;
`;

const Main = styled(Flex).attrs({flex: 1})`
    flex-direction: column;
    min-width: 0;
`;

const Sidebar = styled(Flex).attrs({width: 280})`
    flex-shrink: 0;
    flex-direction: column;
    border-left: 1px solid #e5e7eb;
    background: #FFFFFF;
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
    color: ${({$up}) => ($up === true ? '#ef4444' : $up === false ? '#2563eb' : '#111')};
`;

const AssetChange = styled.span<{ $up?: boolean }>`
    font-size: 14px;
    color: ${({$up}) => ($up === true ? '#ef4444' : $up === false ? '#2563eb' : '#64748b')};
`;

// ========== 탭 (시세 | 이벤트 발생) ==========
const Tabs = styled(Flex).attrs({row: true, gap: 0})`
    border-bottom: 1px solid #e5e7eb;
    padding: 0 20px;
`;

const Tab = styled.button<{ $active?: boolean }>`
    padding: 14px 20px;
    font-size: 14px;
    font-weight: 500;
    color: ${({$active}) => ($active ? '#2563eb' : '#64748b')};
    background: none;
    border: none;
    cursor: pointer;
    margin-bottom: -1px;

    &:hover {
        color: ${({$active}) => ($active ? '#2563eb' : '#334155')};
    }
`;

// ========== 차트 영역 ==========
const ChartSection = styled(Flex).attrs({flex: 1})`
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

// ========== 차트 하단: 매수/매도 버튼 ==========
const OrderSection = styled(Flex).attrs({row: true, gap: 16, flexEnd: true})`
    padding: 20px;
    background: #fff;
    border-bottom: 1px solid #e5e7eb;
`;

const OrderTriggerBtn = styled.button<{ $buy?: boolean }>`
    width: 130px;
    padding: 12px 20px;
    font-size: 15px;
    font-weight: 600;
    color: #fff;
    background: ${({$buy}) => ($buy ? '#F06B6B' : '#1783FF')};
    border: none;
    border-radius: 8px;
    cursor: pointer;

    &:hover {
        opacity: 0.9;
    }
`;

// ========== 주문 모달 ==========
const ModalOverlay = styled.div`
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.45);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
`;

const ModalPanel = styled(Flex).attrs({gap: 0})`
    width: 100%;
    max-width: 400px;
    padding: 20px 24px 24px;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
`;

const ModalHeader = styled(Flex).attrs({row: true, verticalCenter: true})`
    justify-content: space-between;
    align-items: flex-start;
`;

const ModalBackBtn = styled.button`
    padding: 4px 8px;
    font-size: 20px;
    line-height: 1;
    color: #374151;
    background: none;
    border: none;
    cursor: pointer;

    &:hover {
        color: #111;
    }
`;

const OrderAvailableValue = styled(Flex).attrs({gap: 2})`
    flex-direction: column;
    align-items: flex-end;
    font-size: 14px;
    color: #374151;
`;

const ModalFieldRow = styled(Flex).attrs({row: true, verticalCenter: true})`
    justify-content: space-between;
    align-items: center;
    gap: 16px;
`;

const ModalFieldLabel = styled.label`
    font-size: 14px;
    color: #374151;
    flex-shrink: 0;
    min-width: 100px;
`;

const ModalInput = styled.input`
    background-color: #FFF;
    flex: 1;
    min-width: 0;
    padding: 10px 12px;
    font-size: 14px;
    color: #111;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    box-sizing: border-box;
    text-align: right;

    &::placeholder {
        color: #9ca3af;
    }

    &:focus {
        outline: none;
        border-color: #3b82f6;
    }
`;

const PctButtons = styled(Flex).attrs({row: true, gap: 8})`
    align-items: flex-end;
    margin-left: auto;
    width: 284px;
`;

const PctBtn = styled.button`
    display: flex;
    flex: 1;
    padding: 10px 0;
    font-size: 12px;
    color: #374151;
    background: #fff;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    cursor: pointer;
    justify-content: center;
    align-items: center;

    &:hover {
        background: #f9fafb;
        border-color: #9ca3af;
    }
`;

const ModalSubmitWrap = styled(Flex)`
    align-items: flex-end;
    margin-top: 24px;
`;

const ModalSubmitBtn = styled.button<{ $buy?: boolean }>`
    padding: 12px 28px;
    font-size: 15px;
    font-weight: 600;
    color: #fff;
    background: #3b82f6;
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
    background-color: #FFFFFF;
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
    background: ${({$selected}) => ($selected ? '#eff6ff' : 'transparent')};

    &:hover {
        background: ${({$selected}) => ($selected ? '#eff6ff' : '#f8fafc')};
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
    color: ${({$up}) => ($up === true ? '#ef4444' : $up === false ? '#2563eb' : '#64748b')};
`;

type TabId = 'quote' | 'events';

type OrderModalType = 'buy' | 'sell' | null;

function ExchangePage() {
    const [activeTab, setActiveTab] = useState<TabId>('quote');
    const [selectedMemberId, setSelectedMemberId] = useState<string>('me');
    const [searchKeyword, setSearchKeyword] = useState('');
    const [orderModal, setOrderModal] = useState<OrderModalType>(null);
    const [modalQuantity, setModalQuantity] = useState('');
    const [modalTotal, setModalTotal] = useState('');

    const openOrderModal = (type: 'buy' | 'sell') => {
        setOrderModal(type);
        setModalQuantity('');
        setModalTotal('');
    };
    const closeOrderModal = () => {
        setOrderModal(null);
        setModalQuantity('');
        setModalTotal('');
    };

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
                    <AssetPrice
                        $up={selectedMember.changePercent > 0 ? false : selectedMember.changePercent < 0 ? true : undefined}>
                        {formatPrice(selectedMember.currentPrice)} KRW
                    </AssetPrice>
                    <AssetChange
                        $up={selectedMember.changePercent > 0 ? true : selectedMember.changePercent < 0 ? false : undefined}>
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

                        {/* 매수 / 매도 버튼 */}
                        <OrderSection>
                            <OrderTriggerBtn $buy onClick={() => openOrderModal('buy')}>
                                매수
                            </OrderTriggerBtn>
                            <OrderTriggerBtn $buy={false} onClick={() => openOrderModal('sell')}>
                                매도
                            </OrderTriggerBtn>
                        </OrderSection>

                        {/* 주문 모달 */}
                        {orderModal !== null && (
                            <ModalOverlay onClick={closeOrderModal}>
                                <ModalPanel onClick={(e) => e.stopPropagation()}>
                                    <ModalHeader>
                                        <ModalBackBtn
                                            type="button"
                                            onClick={closeOrderModal}
                                            aria-label="닫기"
                                        >
                                            ←
                                        </ModalBackBtn>
                                    </ModalHeader>
                                    <Flex gap={10}>
                                        <ModalFieldRow>
                                            <ModalFieldLabel>주문가능</ModalFieldLabel>
                                            <OrderAvailableValue>
                                                <span>{orderModal === 'buy' ? formatPrice(1000000) : formatPrice(selectedMember.currentPrice * 10)} KRW</span>
                                            </OrderAvailableValue>
                                        </ModalFieldRow>
                                        <ModalFieldRow>
                                            <ModalFieldLabel>주문수량({selectedMember.name})</ModalFieldLabel>
                                            <ModalInput
                                                type="text"
                                                placeholder="0"
                                                value={modalQuantity}
                                                onChange={(e) => {
                                                    const q = e.target.value.replace(/[^0-9.]/g, '');
                                                    setModalQuantity(q);
                                                    const n = Number(q);
                                                    setModalTotal(isNaN(n) ? '' : formatPrice(n * selectedMember.currentPrice));
                                                }}
                                            />
                                        </ModalFieldRow>

                                        <PctButtons>
                                            {(['10%', '50%', '100%', '직접입력'] as const).map((label) => (
                                                <PctBtn
                                                    key={label}
                                                    type="button"
                                                    onClick={() => {
                                                        if (label === '직접입력') return;
                                                        const pct = label === '10%' ? 0.1 : label === '50%' ? 0.5 : 1;
                                                        const maxQ = orderModal === 'buy' ? 1000000 / selectedMember.currentPrice : 10;
                                                        const q = maxQ * pct;
                                                        setModalQuantity(q.toFixed(2));
                                                        setModalTotal(formatPrice(q * selectedMember.currentPrice));
                                                    }}
                                                >
                                                    {label}
                                                </PctBtn>
                                            ))}
                                        </PctButtons>

                                        <ModalFieldRow>
                                            <ModalFieldLabel>주문총액</ModalFieldLabel>
                                            <ModalInput
                                                type="text"
                                                placeholder="0"
                                                value={modalTotal}
                                                onChange={(e) => {
                                                    const v = e.target.value.replace(/[^0-9]/g, '');
                                                    setModalTotal(v ? formatPrice(Number(v)) : '');
                                                    const n = Number(v.replace(/,/g, ''));
                                                    setModalQuantity(selectedMember.currentPrice > 0 && !isNaN(n) ? (n / selectedMember.currentPrice).toFixed(2) : '');
                                                }}
                                            />
                                        </ModalFieldRow>
                                    </Flex>
                                    <ModalSubmitWrap>
                                        <ModalSubmitBtn $buy={orderModal === 'buy'} type="button">
                                            {orderModal === 'buy' ? '매수' : '매도'}
                                        </ModalSubmitBtn>
                                    </ModalSubmitWrap>
                                </ModalPanel>
                            </ModalOverlay>
                        )}
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
                                    <td style={{color: ev.priceChange.startsWith('+') ? '#ef4444' : '#2563eb'}}>
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
                <Flex row style={{padding: '8px 16px', fontSize: 12, color: '#94a3b8'}}>
                    <span style={{flex: 1}}>이름</span>
                    <span style={{width: 56, textAlign: 'right'}}>현재가</span>
                    <span style={{width: 52, textAlign: 'right'}}>전일대비</span>
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
