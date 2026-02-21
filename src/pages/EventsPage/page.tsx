import styled from 'styled-components';
import Flex from '../../../components/common/Flex';

type EventItem = {
  id: string;
  occurredAt: string;
  title: string;
  summary: string;
  impact: string;
  positive?: boolean;
};

const MOCK_EVENTS: EventItem[] = [
  {
    id: 'ev-1',
    occurredAt: '2026-02-22 09:10',
    title: '친구A 메시지 급증',
    summary: '최근 1시간 활동 점수 상승으로 친구A 주가가 반영되었습니다.',
    impact: '+4.52%',
    positive: true,
  },
  {
    id: 'ev-2',
    occurredAt: '2026-02-22 08:00',
    title: '리액션 감소',
    summary: '친구C 리액션 취소 이벤트로 주가가 하락 반영되었습니다.',
    impact: '-1.18%',
    positive: false,
  },
  {
    id: 'ev-3',
    occurredAt: '2026-02-21 22:00',
    title: '시간 단위 정산 완료',
    summary: '전체 유저 활동 점수를 반영해 가격이 업데이트되었습니다.',
    impact: '+0.66%',
    positive: true,
  },
];

const MOCK_PENALTIES = [
  '꼴등 유저: 다음 모임 음료 구매',
  '주간 랭킹 반영: 일요일 23:59',
  '방장 공지: 이벤트 로그 확인 필수',
];

const Page = styled(Flex).attrs({ width: '100%' })`
  min-height: calc(100vh - 120px);
  flex-direction: column;
  gap: 20px;
`;

const Header = styled(Flex).attrs({ row: true, verticalCenter: true })`
  justify-content: space-between;
  padding: 8px 2px;
  flex-wrap: wrap;
  gap: 12px;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  color: #0f172a;
`;

const UpdatedAt = styled.span`
  font-size: 13px;
  color: #64748b;
`;

const TopRow = styled(Flex).attrs({ row: true, gap: 16 })`
  width: 100%;
  align-items: stretch;
  flex-wrap: wrap;
`;

const SummaryCard = styled(Flex).attrs({ flex: 1, gap: 8 })`
  min-width: 260px;
  padding: 18px;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  background: #f8fbff;
`;

const SummaryLabel = styled.span`
  font-size: 13px;
  color: #64748b;
`;

const SummaryValue = styled.span`
  font-size: 28px;
  font-weight: 700;
  color: #0f172a;
`;

const SummarySub = styled.span<{ $positive?: boolean }>`
  font-size: 13px;
  color: ${({ $positive }) => ($positive ? '#dc2626' : '#2563eb')};
`;

const PenaltyCard = styled(Flex).attrs({ flex: 1, gap: 10 })`
  min-width: 280px;
  padding: 18px;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  background: #fff;
`;

const PenaltyTitle = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #334155;
`;

const PenaltyList = styled.ul`
  margin: 0;
  padding-left: 18px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  color: #475569;
  font-size: 13px;
`;

const TableWrap = styled.div`
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  overflow: hidden;
  background: #fff;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  th,
  td {
    padding: 14px 16px;
    border-bottom: 1px solid #eef2f7;
    text-align: left;
    font-size: 14px;
    color: #0f172a;
  }

  th {
    font-size: 13px;
    font-weight: 600;
    color: #64748b;
    background: #f8fafc;
  }

  tr:last-child td {
    border-bottom: none;
  }
`;

const ImpactText = styled.span<{ $positive?: boolean }>`
  font-weight: 600;
  color: ${({ $positive }) => ($positive ? '#dc2626' : '#2563eb')};
`;

function EventsPage() {
  return (
    <Page>
      <Header>
        <Title>이벤트 발생</Title>
        <UpdatedAt>최근 업데이트: 2026-02-22 09:10</UpdatedAt>
      </Header>

      <TopRow>
        <SummaryCard>
          <SummaryLabel>오늘 누적 이벤트</SummaryLabel>
          <SummaryValue>18건</SummaryValue>
          <SummarySub $positive>전일 대비 +5건</SummarySub>
        </SummaryCard>

        <PenaltyCard>
          <PenaltyTitle>패널티/공지</PenaltyTitle>
          <PenaltyList>
            {MOCK_PENALTIES.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </PenaltyList>
        </PenaltyCard>
      </TopRow>

      <TableWrap>
        <Table>
          <thead>
            <tr>
              <th>발생 일시</th>
              <th>이벤트</th>
              <th>설명</th>
              <th>영향</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_EVENTS.map((event) => (
              <tr key={event.id}>
                <td>{event.occurredAt}</td>
                <td>{event.title}</td>
                <td>{event.summary}</td>
                <td>
                  <ImpactText $positive={event.positive}>{event.impact}</ImpactText>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableWrap>
    </Page>
  );
}

export default EventsPage;
