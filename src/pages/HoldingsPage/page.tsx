import styled from 'styled-components';
import Flex from '../../../components/common/Flex';

// Mock: 보유 자산 (연동 후 API로 대체)
const MOCK_HOLDINGS = [
  { id: '1', name: '내 주식', quantity: 10, avgPrice: 12000, currentPrice: 12500 },
  { id: '2', name: '친구A 주식', quantity: 5, avgPrice: 8000, currentPrice: 8300 },
];
const MOCK_KRW = 977;

type Holding = (typeof MOCK_HOLDINGS)[number];

function getPurchaseAmount(h: Holding) {
  return h.quantity * h.avgPrice;
}
function getValuation(h: Holding) {
  return h.quantity * h.currentPrice;
}
function getProfitPercent(h: Holding) {
  const purchase = getPurchaseAmount(h);
  return purchase === 0 ? 0 : ((getValuation(h) - purchase) / purchase) * 100;
}

// ========== Layout ==========
const Page = styled(Flex).attrs({ width: '100%' })`
  min-height: calc(100vh - 120px);
  flex-direction: column;
  background: #fff;
`;

// ========== 상단 보유 자산 ==========
const TopSection = styled(Flex).attrs({ row: true })`
  flex-wrap: wrap;
  gap: 24px;
  padding: 24px;
  border-bottom: 1px solid #e5e7eb;
`;

const SummaryCard = styled(Flex).attrs({ gap: 12 })`
  min-width: 240px;
  padding: 20px;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
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

const ChartCard = styled(Flex).attrs({ gap: 16 })`
  flex: 1;
  min-width: 280px;
  padding: 20px;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
`;

const ChartTitle = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #334155;
`;

const ChartRow = styled(Flex).attrs({ row: true })`
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
`;

const PieWrap = styled.div`
  position: relative;
  width: 180px;
  height: 180px;
  flex-shrink: 0;
`;

const PieSvg = styled.svg`
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
`;

const PieCenter = styled(Flex).attrs({ center: true })`
  position: absolute;
  inset: 50%;
  transform: translate(-50%, -50%);
  width: 90px;
  height: 90px;
  background: #fff;
  border-radius: 50%;
  font-size: 13px;
  color: #64748b;
  flex-direction: column;
  gap: 2px;
`;

const Legend = styled(Flex).attrs({ gap: 8 })`
  font-size: 13px;
  color: #334155;
`;

const LegendItem = styled(Flex).attrs({ row: true, verticalCenter: true })`
  gap: 6px;
`;

const LegendDot = styled.span<{ $color: string }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
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
  color: ${({ $up }) => ($up === true ? '#ef4444' : $up === false ? '#2563eb' : '#64748b')};
  font-weight: 500;
`;

// Pie colors
const PIE_COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

function HoldingsPage() {
  const totalValuation = MOCK_HOLDINGS.reduce((s, h) => s + getValuation(h), 0);
  const totalWithKrw = totalValuation + MOCK_KRW;

  // 보유 비중: 주식만 표시 (KRW 제외)
  const pieSegments: { percent: number; color: string; label: string }[] = [];
  MOCK_HOLDINGS.forEach((h, i) => {
    const p = totalValuation === 0 ? 0 : (getValuation(h) / totalValuation) * 100;
    if (p > 0) pieSegments.push({ percent: p, color: PIE_COLORS[i % PIE_COLORS.length], label: h.name });
  });

  let cumulative = 0;
  const piePaths = pieSegments.map((s) => {
    const start = cumulative;
    cumulative += s.percent;
    const angle = (s.percent / 100) * 360;
    const end = start + angle;
    const x1 = 50 + 50 * Math.cos((start * Math.PI) / 180);
    const y1 = 50 + 50 * Math.sin((start * Math.PI) / 180);
    const x2 = 50 + 50 * Math.cos((end * Math.PI) / 180);
    const y2 = 50 + 50 * Math.sin((end * Math.PI) / 180);
    const large = angle > 180 ? 1 : 0;
    const d = `M 50 50 L ${x1} ${y1} A 50 50 0 ${large} 1 ${x2} ${y2} Z`;
    return { d, color: s.color };
  });
  const pieTotalPercent = pieSegments.reduce((s, x) => s + x.percent, 0);

  const formatKrw = (n: number) => `${n.toLocaleString('ko-KR')} KRW`;
  const formatPercent = (n: number) => `${n >= 0 ? '+' : ''}${n.toFixed(2)}%`;

  return (
    <Page>
      {/* 상단 보유 자산 */}
      <TopSection>
        <SummaryCard>
          <SummaryLabel>총 보유자산</SummaryLabel>
          <SummaryValue>{formatKrw(totalWithKrw)}</SummaryValue>
        </SummaryCard>

        <ChartCard>
          <ChartTitle>보유 비중</ChartTitle>
          <ChartRow>
            <PieWrap>
              <PieSvg viewBox="0 0 100 100">
                {piePaths.map((p, i) => (
                  <path key={i} d={p.d} fill={p.color} />
                ))}
              </PieSvg>
              <PieCenter>
                <span>보유 비중 (%)</span>
                <span style={{ fontWeight: 600, color: '#111' }}>{pieTotalPercent.toFixed(1)}</span>
              </PieCenter>
            </PieWrap>
            <Legend>
              {pieSegments.map((s, i) => (
                <LegendItem key={i}>
                  <LegendDot $color={s.color} />
                  <span>{s.label}</span>
                  <span>{s.percent.toFixed(1)}%</span>
                </LegendItem>
              ))}
            </Legend>
          </ChartRow>
        </ChartCard>
      </TopSection>

      {/* 하단 보유 자산 목록 리스트 */}
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
              {MOCK_HOLDINGS.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', color: '#94a3b8', padding: 32 }}>
                    보유 자산이 없습니다.
                  </td>
                </tr>
              ) : (
                MOCK_HOLDINGS.map((h) => {
                  const profit = getValuation(h) - getPurchaseAmount(h);
                  const profitPct = getProfitPercent(h);
                  return (
                    <tr key={h.id}>
                      <td>{h.name}</td>
                      <td>{h.quantity.toLocaleString()}</td>
                      <td>{formatKrw(h.avgPrice)}</td>
                      <td>{formatKrw(getPurchaseAmount(h))}</td>
                      <td>{formatKrw(getValuation(h))}</td>
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
