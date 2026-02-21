import {useState} from 'react';
import styled from 'styled-components';
import Flex from '../../../components/common/Flex';
import {useExchangePage} from './exchangePageContext';

const ChartSection = styled(Flex).attrs({flex: 1})`
    min-height: 360px;
    padding: 16px 50px;
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

const OrderSection = styled(Flex).attrs({row: true, gap: 16, flexEnd: true})`
    padding: 20px 50px;
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
    background-color: #fff;
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

const ModalSubmitBtn = styled.button`
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

type OrderModalType = 'buy' | 'sell' | null;

export default function QuoteTab() {
    const {selectedMember, selectedMemberId, formatPrice} = useExchangePage();
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

    return (
        <>
            <ChartSection>
                <ChartPlaceholder>
                    {selectedMemberId === 'me' ? '내 차트' : `${selectedMember.name} 차트`} · 연동 후 실제 차트가 표시됩니다.
                </ChartPlaceholder>
            </ChartSection>

            <OrderSection>
                <OrderTriggerBtn $buy onClick={() => openOrderModal('buy')}>
                    매수
                </OrderTriggerBtn>
                <OrderTriggerBtn $buy={false} onClick={() => openOrderModal('sell')}>
                    매도
                </OrderTriggerBtn>
            </OrderSection>

            {orderModal !== null && (
                <ModalOverlay onClick={closeOrderModal}>
                    <ModalPanel onClick={(e) => e.stopPropagation()}>
                        <ModalHeader>
                            <ModalBackBtn type="button" onClick={closeOrderModal} aria-label="닫기">
                                ←
                            </ModalBackBtn>
                        </ModalHeader>
                        <Flex gap={10}>
                            <ModalFieldRow>
                                <ModalFieldLabel>주문가능</ModalFieldLabel>
                                <OrderAvailableValue>
                  <span>
                    {orderModal === 'buy'
                        ? formatPrice(1000000)
                        : formatPrice(selectedMember.currentPrice * 10)}{' '}
                      KRW
                  </span>
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
                                        setModalQuantity(
                                            selectedMember.currentPrice > 0 && !isNaN(n)
                                                ? (n / selectedMember.currentPrice).toFixed(2)
                                                : ''
                                        );
                                    }}
                                />
                            </ModalFieldRow>
                        </Flex>
                        <ModalSubmitWrap>
                            <ModalSubmitBtn type="button">{orderModal === 'buy' ? '매수' : '매도'}</ModalSubmitBtn>
                        </ModalSubmitWrap>
                    </ModalPanel>
                </ModalOverlay>
            )}
        </>
    );
}
