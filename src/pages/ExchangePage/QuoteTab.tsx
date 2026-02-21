import {useState, useEffect, useRef} from 'react';
import styled from 'styled-components';
import {createChart, CandlestickSeries} from 'lightweight-charts';
import Flex from '../../../components/common/Flex';
import {FiChevronLeft} from 'react-icons/fi';
import {getStockDetail} from '../../api/stock';
import type {StockHistoryPoint} from '../../api/stock';
import {useExchangePage} from './exchangePageContext';
import {buyStock, sellStock} from '../../api/stock';

const ChartSection = styled(Flex).attrs({flex: 1})`
    padding: 0 50px;
    min-height: 360px;
    background: #fff;
    border-bottom: 1px solid #e5e7eb;
    position: relative;
`;

const ChartWrap = styled.div`
    width: 100%;
    height: 320px;
    border-radius: 8px;
    overflow: hidden;
`;

const ChartOverlay = styled.div`
    position: absolute;
    inset: 16px 50px 0;
    height: 320px;
    border-radius: 8px;
    background: rgba(248, 250, 252, 0.95);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #94a3b8;
    font-size: 14px;
`;


/** 1분봉: time은 해당 분의 시작 시각(UTC 초) */
type CandlePoint = { time: number; open: number; high: number; low: number; close: number };

/** history를 1분 단위로 묶어 OHLC 캔들로 변환. 새 데이터가 오른쪽으로 이어지는 실시간 차트용 */
function historyTo1MinCandles(history: StockHistoryPoint[]): CandlePoint[] {
    if (!history || history.length === 0) return [];
    const sorted = [...history].sort(
        (a, b) => new Date(a.recorded_at).getTime() - new Date(b.recorded_at).getTime()
    );
    const byMinute = new Map<number, number[]>();
    for (const p of sorted) {
        const t = new Date(p.recorded_at).getTime();
        const minuteStart = Math.floor(t / 60000) * 60000;
        const key = minuteStart;
        if (!byMinute.has(key)) byMinute.set(key, []);
        byMinute.get(key)!.push(parseFloat(p.price));
    }
    const result: CandlePoint[] = [];
    const keys = Array.from(byMinute.keys()).sort((a, b) => a - b);
    for (const key of keys) {
        const prices = byMinute.get(key)!;
        result.push({
            time: key / 1000,
            open: prices[0]!,
            high: Math.max(...prices),
            low: Math.min(...prices),
            close: prices[prices.length - 1]!,
        });
    }
    return result;
}

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

const ModalSubmitBtn = styled.button<{ $disabled?: boolean }>`
    padding: 12px 28px;
    font-size: 15px;
    font-weight: 600;
    color: #fff;
    background: ${({$disabled}) => ($disabled ? '#94a3b8' : '#3b82f6')};
    border: none;
    border-radius: 8px;
    cursor: ${({$disabled}) => ($disabled ? 'not-allowed' : 'pointer')};

    &:hover {
        opacity: ${({$disabled}) => ($disabled ? 1 : 0.9)};
    }
`;

const ModalMessage = styled.div<{ $error?: boolean }>`
    font-size: 13px;
    margin-top: 8px;
    color: ${({$error}) => ($error ? '#dc2626' : '#16a34a')};
`;

type OrderModalType = 'buy' | 'sell' | null;

export default function QuoteTab() {
    const {selectedMember, selectedMemberId, formatPrice} = useExchangePage();
    const [orderModal, setOrderModal] = useState<OrderModalType>(null);
    const [modalQuantity, setModalQuantity] = useState('');
    const [modalTotal, setModalTotal] = useState('');
    const [submitLoading, setSubmitLoading] = useState(false);
    const [modalMessage, setModalMessage] = useState<{ text: string; error: boolean } | null>(null);
    const [chartLoading, setChartLoading] = useState(true);
    const [chartError, setChartError] = useState<string | null>(null);
    const [candleData, setCandleData] = useState<CandlePoint[]>([]);
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<ReturnType<typeof createChart> | null>(null);
    const seriesRef = useRef<{ setData: (data: CandlePoint[]) => void } | null>(null);

    const POLL_INTERVAL_MS = 10_000;

    useEffect(() => {
        const stockId = Number(selectedMemberId);
        if (Number.isNaN(stockId) || selectedMemberId === '') {
            setCandleData([]);
            setChartLoading(false);
            setChartError(null);
            return;
        }

        function fetchChart() {
            getStockDetail(stockId)
                .then((res) => {
                    setCandleData(historyTo1MinCandles(res.history ?? []));
                    setChartError(null);
                })
                .catch((e) => {
                    setChartError(e instanceof Error ? e.message : '차트 데이터를 불러오지 못했습니다.');
                    setCandleData([]);
                })
                .finally(() => setChartLoading(false));
        }

        setChartLoading(true);
        setChartError(null);
        fetchChart();

        const intervalId = setInterval(fetchChart, POLL_INTERVAL_MS);
        return () => clearInterval(intervalId);
    }, [selectedMemberId]);

    useEffect(() => {
        if (!chartContainerRef.current) return;
        const chart = createChart(chartContainerRef.current, {
            layout: {background: {color: '#fff'}, textColor: '#334155'},
            grid: {vertLines: {color: '#f1f5f9'}, horzLines: {color: '#f1f5f9'}},
            width: chartContainerRef.current.clientWidth,
            height: 320,
            timeScale: {
                timeVisible: true,
                secondsVisible: true,
                rightOffset: 12,
            },
            rightPriceScale: {borderColor: '#e2e8f0'},
        });
        const series = chart.addSeries(CandlestickSeries, {
            upColor: '#ef4444',
            downColor: '#2563eb',
            borderUpColor: '#ef4444',
            borderDownColor: '#2563eb',
            wickUpColor: '#ef4444',
            wickDownColor: '#2563eb',
        }) as unknown as { setData: (data: CandlePoint[]) => void };
        chartRef.current = chart;
        seriesRef.current = series;
        return () => {
            chart.remove();
            chartRef.current = null;
            seriesRef.current = null;
        };
    }, []);

    useEffect(() => {
        if (!seriesRef.current || !chartRef.current) return;
        if (candleData.length > 0) {
            seriesRef.current.setData(candleData);
            chartRef.current.timeScale().fitContent();
        }
    }, [candleData]);

    const openOrderModal = (type: 'buy' | 'sell') => {
        setOrderModal(type);
        setModalQuantity('');
        setModalTotal('');
        setModalMessage(null);
    };
    const closeOrderModal = () => {
        setOrderModal(null);
        setModalQuantity('');
        setModalTotal('');
        setModalMessage(null);
    };

    const handleBuySubmit = async () => {
        setModalMessage(null);
        const qty = Math.floor(Number(modalQuantity));
        if (!qty || qty < 1) {
            setModalMessage({text: '주문수량을 입력해 주세요.', error: true});
            return;
        }
        const stockUserId = Number(selectedMember.id);
        if (Number.isNaN(stockUserId)) {
            setModalMessage({text: '유효하지 않은 주식입니다.', error: true});
            return;
        }
        setSubmitLoading(true);
        try {
            await buyStock({quantity: qty, stock_user_id: stockUserId});
            setModalMessage({text: '매수가 완료되었습니다.', error: false});
            setModalQuantity('');
            setModalTotal('');
            setTimeout(() => closeOrderModal(), 1500);
        } catch (e) {
            const msg =
                e instanceof Error
                    ? e.message
                    : '매수 요청에 실패했습니다.';
            setModalMessage({text: msg, error: true});
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleSellSubmit = async () => {
        setModalMessage(null);
        const qty = Math.floor(Number(modalQuantity));
        if (!qty || qty < 1) {
            setModalMessage({text: '주문수량을 입력해 주세요.', error: true});
            return;
        }
        const stockUserId = Number(selectedMember.id);
        if (Number.isNaN(stockUserId)) {
            setModalMessage({text: '유효하지 않은 주식입니다.', error: true});
            return;
        }
        setSubmitLoading(true);
        try {
            await sellStock({quantity: qty, stock_user_id: stockUserId});
            setModalMessage({text: '매도가 완료되었습니다.', error: false});
            setModalQuantity('');
            setModalTotal('');
            setTimeout(() => closeOrderModal(), 1500);
        } catch (e) {
            const msg =
                e instanceof Error
                    ? e.message
                    : '매도 요청에 실패했습니다.';
            setModalMessage({text: msg, error: true});
        } finally {
            setSubmitLoading(false);
        }
    };

    return (
        <>
            <ChartSection center>
                <ChartWrap ref={chartContainerRef}/>
                {chartLoading && <ChartOverlay>차트 로딩 중...</ChartOverlay>}
                {!chartLoading && chartError && (
                    <ChartOverlay style={{color: '#dc2626'}}>{chartError}</ChartOverlay>
                )}
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
                                <FiChevronLeft size={22}/>
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
                        {modalMessage && (
                            <ModalMessage $error={modalMessage.error}>{modalMessage.text}</ModalMessage>
                        )}
                        <ModalSubmitWrap>
                            <ModalSubmitBtn
                                type="button"
                                $disabled={submitLoading}
                                onClick={() => {
                                    if (orderModal === 'buy') handleBuySubmit();
                                    else handleSellSubmit();
                                }}
                            >
                                {submitLoading ? '처리 중...' : orderModal === 'buy' ? '매수' : '매도'}
                            </ModalSubmitBtn>
                        </ModalSubmitWrap>
                    </ModalPanel>
                </ModalOverlay>
            )}
        </>
    );
}
