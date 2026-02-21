import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { listRooms } from '../api';
import Flex from '../components/common/Flex';

type RoomItem = {
  id: string;
  title: string;
  people: string;
  period: string;
  endDate: string | null;
};

const Page = styled(Flex)`
  width: min(1260px, calc(100vw - 40px));
  margin: 0 auto;
  flex-direction: column;
  padding: 16px 0 26px;
`;

const Logo = styled.p`
  margin: 0;
  font-family: 'Hakgyoansim Allimjang OTF', 'Pretendard', sans-serif;
  font-size: 34px;
  color: #1783ff;
  line-height: 1;
`;

const Grid = styled.div`
  margin-top: 78px;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;

  @media (max-width: 1180px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  @media (max-width: 980px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.article<{ $dimmed?: boolean }>`
  position: relative;
  height: 165px;
  border-radius: 10px;
  background: ${({ $dimmed }) => ($dimmed ? '#c6c6c8' : '#ffffff')};
  box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.08);
  padding: 14px 16px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const PlusCard = styled(Card)`
  border: none;
  align-items: center;
  justify-content: center;
  gap: 0;
  cursor: pointer;
`;

const PlusIcon = styled.div`
  color: #000000;
  font-size: 96px;
  font-weight: 200;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PlusText = styled.p`
  display: none;
  margin: 0;
  font-family: 'Pretendard', sans-serif;
  font-size: 28px;
  color: #1783ff;
  font-weight: 600;
`;

const StatusText = styled.p`
  margin: 16px 0 0;
  font-family: 'Pretendard', sans-serif;
  font-size: 13px;
  color: #767676;
`;

function formatDateLabel(value?: string | null): string {
  if (!value) {
    return '-';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '-';
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
}

function formatPeriod(startDate?: string | null, endDate?: string | null): string {
  if (!startDate && !endDate) {
    return '기간 미정';
  }

  return `${formatDateLabel(startDate)} ~ ${formatDateLabel(endDate)}`;
}

const Title = styled.p`
  margin: 0;
  font-family: 'Pretendard', sans-serif;
  font-size: 12px;
  font-weight: 600;
  line-height: 1.4;
  color: #000000;
`;

const People = styled.p`
  margin: 10px 0 0;
  font-family: 'Pretendard', sans-serif;
  font-size: 10px;
  font-weight: 500;
  line-height: 1.4;
  color: #000000;
`;

const Period = styled.p`
  margin: 0;
  font-family: 'Pretendard', sans-serif;
  font-size: 12px;
  font-weight: 500;
  line-height: 1.4;
  color: #000000;
`;

function isExpired(endDate?: string | null): boolean {
  if (!endDate) {
    return false;
  }

  const end = new Date(`${endDate}T23:59:59`);
  if (Number.isNaN(end.getTime())) {
    return false;
  }

  return end.getTime() < Date.now();
}

function RoomSelectPage() {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<RoomItem[]>([]);
  const [statusText, setStatusText] = useState('');

  useEffect(() => {
    async function fetchRooms() {
      setStatusText('방 목록을 불러오는 중입니다...');

      try {
        const response = await listRooms();
        const mapped: RoomItem[] = response.map((room) => ({
          id: room.room_code,
          title: room.title,
          people: `${room.member_count}명 참여 중`,
          period: formatPeriod(room.start_date, room.end_date),
          endDate: room.end_date ?? null,
        }));
        setRooms(mapped);
        setStatusText(mapped.length > 0 ? '' : '생성된 방이 없습니다.');
      } catch (error) {
        const message = error instanceof Error ? error.message : '방 목록 조회에 실패했습니다.';
        setStatusText(message);
      }
    }

    void fetchRooms();
  }, []);

  return (
    <Page>
      <Logo>FOSPI</Logo>

      <Grid>
        <PlusCard onClick={() => navigate('/create')}>
          <PlusIcon aria-hidden>+</PlusIcon>
          <PlusText>참여코드 생성</PlusText>
        </PlusCard>

        {rooms.map((room) => (
          <Card key={room.id} $dimmed={isExpired(room.endDate)}>
            <div>
              <Title>{room.title}</Title>
              <People>{room.people}</People>
            </div>
            <Period>{room.period}</Period>
          </Card>
        ))}
      </Grid>

      {statusText && <StatusText>{statusText}</StatusText>}
    </Page>
  );
}

export default RoomSelectPage;
