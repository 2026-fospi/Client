import {useEffect, useState} from 'react';
import styled from 'styled-components';
import Flex from '../../../components/common/Flex';
import {getMyAssets} from '../../api/asset';
import type {MyAssetsResponse, AssetHolding} from '../../api/asset';

// ========== Layout ==========
const Page = styled(Flex).attrs({width: '100%'})`
    min-height: calc(100vh - 120px);
    padding: 40px 100px;
    flex-direction: column;
    background: #fff;
`;

// ========== 상단 보유 자산 ==========
const TopSection = styled(Flex)`
    gap: 24px;
    padding: 50px;
    border-bottom: 1px solid #e5e7eb;
`;

const SummaryLabel = styled.span`
    font-size: 13px;
    color: #64748b;
`;

const SummaryValue = styled.span`
    font-size: 18px;
    font-weight: 600;
    color: #111;
`;

const ChartRow = styled(Flex).attrs({row: true})`
    align-items: flex-end;
    gap: 24px;
    flex-wrap: wrap;
`;

const PieWrap = styled.div`
    position: relative;
    width: 200px;
    height: 200px;
    flex-shrink: 0;
`;

const PieSvg = styled.svg`
    width: 100%;
    height: 100%;
    transform: rotate(-90deg);
`;

const PieCenter = styled(Flex).attrs({center: true})`
    position: absolute;
    inset: 50%;
    transform: translate(-50%, -50%);
    width: 100px;
    height: 100px;
    background: #fff;
    border-radius: 50%;
    font-size: 13px;
    color: #64748b;
    flex-direction: column;
    gap: 2px;
`;

const Legend = styled(Flex).attrs({gap: 8})`
    font-size: 13px;
    color: #334155;
`;

const LegendItem = styled(Flex).attrs({row: true, verticalCenter: true})`
    gap: 15px;
`;

const LegendDot = styled.span<{ $color: string }>`
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: ${({$color}) => $color};
`;

// ========== 하단 보유 자산 목록 ==========
const ListSection = styled(Flex)`
    flex: 1;
    padding: 24px;
`;

const ListTitle = styled.h2`
    font-size: 16px;
    font-weight: 600;
    color: #111;
    margin: 0 0 16px 0;
`;

const TableWrap = styled.div`
    width: 100%;
    overflow-x: auto;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
`;

const Table = styled.table`
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

    th:not(:first-child),
    td:not(:first-child) {
        text-align: right;
    }

    tr:last-child td {
        border-bottom: none;
    }
`;

const ProfitCell = styled.span<{ $up?: boolean }>`
    color: ${({$up}) => ($up === true ? '#ef4444' : $up === false ? '#2563eb' : '#64748b')};
    font-weight: 500;
`;

const PIE_COLORS = [
    '#3B82F6',
    '#60A5FA',
    '#93C5FD',
    '#E2F2FF',
    '#BFDBFE',
];

function getPurchaseAmount(h: AssetHolding): number {
    return h.quantity * parseFloat(h.avg_buy_price);
}

function getProfitPercent(h: AssetHolding): number {
    const purchase = getPurchaseAmount(h);
    const value = parseFloat(h.total_value);
    return purchase === 0 ? 0 : ((value - purchase) / purchase) * 100;
}

function HoldingsPage() {
    const [data, setData] = useState<MyAssetsResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        async function fetchAssets() {
            setLoading(true);
            setError(null);
            try {
                const res = await getMyAssets();
                if (!cancelled) setData(res);
            } catch (e) {
                if (!cancelled) {
                    setError(e instanceof Error ? e.message : '보유 자산을 불러오지 못했습니다.');
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        fetchAssets();
        return () => {
            cancelled = true;
        };
    }, []);

    const formatKrw = (n: number) => `${n.toLocaleString('ko-KR')} KRW`;
    const formatPercent = (n: number) => `${n >= 0 ? '+' : ''}${n.toFixed(2)}%`;

    if (loading) {
        return (
            <Page>
                <TopSection row center>
                    <SummaryLabel>로딩 중...</SummaryLabel>
                </TopSection>
            </Page>
        );
    }

    if (error) {
        return (
            <Page>
                <TopSection row center>
                    <SummaryValue style={{color: '#dc2626'}}>{error}</SummaryValue>
                </TopSection>
            </Page>
        );
    }

    if (!data) {
        return null;
    }

    const totalAsset = parseFloat(data.total_asset);
    const cash = parseFloat(data.cash);
    const holdings = data.holdings ?? [];

    // 차트: 총 자산 대비 현금 + 각 보유 주식 비중 (비율로 계산)
    const chartSegments: { percent: number; color: string; label: string }[] = [];
    if (totalAsset > 0) {
        if (cash > 0) {
            chartSegments.push({
                percent: (cash / totalAsset) * 100,
                color: '#F9FAFC',
                label: '보유 KRW',
            });
        }
        holdings.forEach((h: AssetHolding, i: number) => {
            const value = parseFloat(h.total_value);
            if (value > 0) {
                chartSegments.push({
                    percent: (value / totalAsset) * 100,
                    color: PIE_COLORS[(i + 1) % PIE_COLORS.length],
                    label: h.stock_user_name,
                });
            }
        });
    }

    // 비율 합이 100%가 되도록 정규화 (반올림 오차 대비)
    const totalPercent = chartSegments.reduce((s, x) => s + x.percent, 0);
    const normalizedSegments =
        totalPercent > 0
            ? chartSegments.map((s) => ({...s, percent: (s.percent / totalPercent) * 100}))
            : chartSegments;

    let cumulativePercent = 0;
    const piePaths = normalizedSegments.map((s) => {
        const startDeg = (cumulativePercent / 100) * 360;
        cumulativePercent += s.percent;
        const angle = (s.percent / 100) * 360;
        const endDeg = startDeg + angle;
        // 360도이면 arc가 그려지지 않으므로 원(circle)으로 처리
        if (angle >= 359.99) {
            return {d: null as string | null, color: s.color, fullCircle: true};
        }
        const x1 = 50 + 50 * Math.cos((startDeg * Math.PI) / 180);
        const y1 = 50 + 50 * Math.sin((startDeg * Math.PI) / 180);
        const x2 = 50 + 50 * Math.cos((endDeg * Math.PI) / 180);
        const y2 = 50 + 50 * Math.sin((endDeg * Math.PI) / 180);
        const large = angle > 180 ? 1 : 0;
        const d = `M 50 50 L ${x1} ${y1} A 50 50 0 ${large} 1 ${x2} ${y2} Z`;
        return {d, color: s.color, fullCircle: false};
    });
    const pieTotalPercent = normalizedSegments.reduce((s, x) => s + x.percent, 0);

    return (
        <Page>
            <TopSection row>
                <Flex row gap={24}>
                    <Flex gap={10}>
                        <SummaryLabel>총 보유자산</SummaryLabel>
                        <SummaryValue>{formatKrw(totalAsset)}</SummaryValue>
                    </Flex>
                </Flex>
                <Flex flex={1} center>
                    <ChartRow>
                        <PieWrap>
                            <PieSvg viewBox="0 0 100 100">
                                {piePaths.map((p, i) =>
                                    p.fullCircle ? (
                                        <circle key={i} cx="50" cy="50" r="50" fill={p.color}/>
                                    ) : (
                                        <path key={i} d={p.d!} fill={p.color}/>
                                    )
                                )}
                            </PieSvg>
                            <PieCenter>
                                <span>보유 비중 (%)</span>
                                <span style={{fontWeight: 600, color: '#111'}}>{pieTotalPercent.toFixed(1)}</span>
                            </PieCenter>
                        </PieWrap>
                        <Legend>
                            {normalizedSegments.map((s, i) => (
                                <LegendItem key={i}>
                                    <LegendDot $color={s.color}/>
                                    <span>{s.label}</span>
                                    <span>{s.percent.toFixed(1)}%</span>
                                </LegendItem>
                            ))}
                        </Legend>
                    </ChartRow>
                </Flex>
            </TopSection>

            <ListSection>
                <ListTitle>보유자산 목록</ListTitle>
                <TableWrap>
                    <Table>
                        <thead>
                        <tr>
                            <th>보유자산</th>
                            <th>보유수량</th>
                            <th>매수평균가</th>
                            <th>매수금액</th>
                            <th>평가금액</th>
                            <th>평가손익(%)</th>
                        </tr>
                        </thead>
                        <tbody>
                        {holdings.length === 0 ? (
                            <tr>
                                <td colSpan={6} style={{textAlign: 'center', color: '#94a3b8', padding: 32}}>
                                    보유 자산이 없습니다.
                                </td>
                            </tr>
                        ) : (
                            holdings.map((h: AssetHolding) => {
                                const purchaseAmount = getPurchaseAmount(h);
                                const valueAmount = parseFloat(h.total_value);
                                const profit = valueAmount - purchaseAmount;
                                const profitPct = getProfitPercent(h);
                                return (
                                    <tr key={h.stock_user_id}>
                                        <td>{h.stock_user_name}</td>
                                        <td>{h.quantity.toLocaleString()}</td>
                                        <td>{formatKrw(parseFloat(h.avg_buy_price))}</td>
                                        <td>{formatKrw(purchaseAmount)}</td>
                                        <td>{formatKrw(valueAmount)}</td>
                                        <td>
                                            <ProfitCell $up={profit > 0 ? true : profit < 0 ? false : undefined}>
                                                {formatPercent(profitPct)}
                                            </ProfitCell>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                        </tbody>
                    </Table>
                </TableWrap>
            </ListSection>
        </Page>
    );
}

export default HoldingsPage;
