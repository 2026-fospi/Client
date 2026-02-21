import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import styled from 'styled-components';
import { createNews, getNews } from '../../api';
import Flex from '../../../components/common/Flex';

type EventCardItem = {
  id: string;
  title: string;
  description: string;
  period: string;
  target: string;
};

type NewsApiItem = {
  id: number;
  title: string;
  content: string;
  related_user_id: number | null;
  created_at: string;
};

const Page = styled(Flex)`
  width: min(1668px, calc(100vw - 80px));
  margin: 0 auto;
  flex-direction: column;
`;

const TopActionRow = styled(Flex).attrs({ row: true, verticalCenter: true })`
  width: min(1020px, 100%);
  margin: 0 auto;
  justify-content: flex-end;
  margin-bottom: 40px;
`;

const AddButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 14px;
  height: 67px;
  min-width: 197px;
  padding: 18px 26px;
  border: none;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 0 29.5px 0 rgba(0, 0, 0, 0.08);
  font-family: 'Pretendard', sans-serif;
  font-size: 18px;
  font-weight: 500;
  color: #000000;
  cursor: pointer;
`;

const PlusIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #1783ff;
  color: #ffffff;
  font-size: 22px;
  line-height: 1;
`;

const Grid = styled.div`
  display: grid;
  width: min(1020px, 100%);
  margin: 0 auto;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 22px 18px;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 620px) {
    grid-template-columns: 1fr;
  }
`;

const EventCard = styled.button`
  height: 283px;
  border: none;
  text-align: left;
  border-radius: 12px;
  background: #ffffff;
  box-shadow: 0 0 29.5px 0 rgba(0, 0, 0, 0.08);
  padding: 22px 28px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;
`;

const CardBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const CardTitle = styled.p`
  margin: 0;
  font-family: 'Pretendard', sans-serif;
  font-size: 16px;
  font-weight: 600;
  line-height: 1.4;
  letter-spacing: 0.15px;
  color: #000000;
`;

const CardDescription = styled.p`
  margin: 0;
  font-family: 'Pretendard', sans-serif;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.4;
  letter-spacing: 0.15px;
  color: #757575;
`;

const CardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: 'Pretendard', sans-serif;
  font-size: 16px;
  font-weight: 500;
  line-height: 1.4;
  letter-spacing: 0.15px;
  color: #585858;
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(128, 128, 128, 0.1);
  backdrop-filter: blur(4px);
  z-index: 40;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const DetailModal = styled.div`
  width: min(709px, calc(100vw - 40px));
  min-height: 690px;
  border-radius: 20px;
  background: #ffffff;
  position: relative;
  padding: 62px 72px 52px;
  box-sizing: border-box;
`;

const CloseButton = styled.button`
  position: absolute;
  left: 28px;
  top: 28px;
  width: 36px;
  height: 36px;
  border: none;
  background: transparent;
  color: #111111;
  font-size: 34px;
  line-height: 1;
  cursor: pointer;
`;

const DetailBody = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 560px;
`;

const DetailTitle = styled.p`
  margin: 0;
  white-space: pre-wrap;
  font-family: 'Pretendard', sans-serif;
  font-size: 34px;
  line-height: 1.4;
  letter-spacing: 0.15px;
  font-weight: 600;
  color: #000000;
`;

const DetailDescription = styled.p`
  margin: 52px 0 0;
  white-space: pre-wrap;
  font-family: 'Pretendard', sans-serif;
  font-size: 28px;
  line-height: 1.4;
  letter-spacing: 0.15px;
  font-weight: 500;
  color: #757575;
`;

const DetailFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: 'Pretendard', sans-serif;
  font-size: 26px;
  line-height: 1.4;
  letter-spacing: 0.15px;
  font-weight: 500;
  color: #757575;
`;

const CreateShell = styled.div`
  width: min(1146px, 100%);
  min-height: 595px;
  margin: 0 auto;
  border-radius: 20px;
  background: #ffffff;
  box-shadow: 0 0 29.5px 0 rgba(0, 0, 0, 0.08);
  padding: 54px 108px 60px;
  box-sizing: border-box;
`;

const CreateForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const Field = styled.label`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const FieldLabel = styled.span`
  font-family: 'Pretendard', sans-serif;
  font-size: 16px;
  font-weight: 500;
  color: #000000;
`;

const FieldInput = styled.input`
  height: 48px;
  border-radius: 8px;
  border: 1px solid #757575;
  background: #ffffff;
  padding: 0 24px;
  font-family: 'Pretendard', sans-serif;
  font-size: 22px;
  color: #000000;
  box-sizing: border-box;
`;

const FieldTextArea = styled.textarea`
  height: 196px;
  border-radius: 10px;
  border: 1px solid #757575;
  background: #ffffff;
  padding: 16px 16px;
  font-family: 'Pretendard', sans-serif;
  font-size: 22px;
  color: #000000;
  resize: none;
  box-sizing: border-box;
`;

const CreateActionRow = styled.div`
  width: 340px;
  margin-left: auto;
  margin-top: 0;
`;

const PrimaryButton = styled.button`
  width: 100%;
  height: 56px;
  border: none;
  border-radius: 12px;
  background: #1783ff;
  color: #ffffff;
  font-family: 'Pretendard', sans-serif;
  font-size: 18px;
  font-weight: 500;
  cursor: pointer;
`;

const StatusMessage = styled.p`
  margin: 16px auto 0;
  width: min(1020px, 100%);
  font-family: 'Pretendard', sans-serif;
  font-size: 16px;
  color: #6b7280;
`;

function formatDateLabel(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return '-';
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function mapNewsToCard(item: NewsApiItem): EventCardItem {
  return {
    id: String(item.id),
    title: item.title,
    description: item.content,
    period: formatDateLabel(item.created_at),
    target: item.related_user_id === null ? '전체' : `유저 #${item.related_user_id}`,
  };
}

function EventsPage() {
  const [events, setEvents] = useState<EventCardItem[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<EventCardItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTarget, setNewTarget] = useState('윤유섭 외 3명 선택됨');
  const [newDescription, setNewDescription] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    async function loadNews() {
      setIsLoading(true);
      setStatusMessage('');

      try {
        const response = await getNews();
        setEvents(response.map(mapNewsToCard));
      } catch (error) {
        const message = error instanceof Error ? error.message : '뉴스 목록을 불러오지 못했습니다.';
        setStatusMessage(message);
      } finally {
        setIsLoading(false);
      }
    }

    void loadNews();
  }, []);

  async function handleCreateEvent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!newTitle.trim() || !newDescription.trim()) {
      setStatusMessage('제목과 내용을 입력해 주세요.');
      return;
    }

    setIsSubmitting(true);
    setStatusMessage('');

    try {
      const created = await createNews({
        title: newTitle.trim(),
        content: newDescription.trim(),
        related_user_id: null,
      });

      const mapped = mapNewsToCard(created);
      mapped.target = newTarget.trim() || mapped.target;

      setEvents((prev) => [mapped, ...prev]);
      setIsCreating(false);
      setSelectedEvent(mapped);
      setNewTitle('');
      setNewDescription('');
    } catch (error) {
      const message = error instanceof Error ? error.message : '뉴스 추가 중 오류가 발생했습니다.';
      setStatusMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Page>
      {isCreating ? (
        <CreateShell>
          <CreateForm onSubmit={handleCreateEvent}>
              <Field>
                <FieldLabel>제목</FieldLabel>
                <FieldInput
                  value={newTitle}
                  onChange={(event) => setNewTitle(event.target.value)}
                  placeholder="제목"
                />
              </Field>

            <Field>
              <FieldLabel>대상</FieldLabel>
              <FieldInput value={newTarget} onChange={(event) => setNewTarget(event.target.value)} />
            </Field>

              <Field>
                <FieldLabel>내용</FieldLabel>
                <FieldTextArea
                  value={newDescription}
                  onChange={(event) => setNewDescription(event.target.value)}
                  placeholder="내용을 입력해주세요."
                />
              </Field>

            <CreateActionRow>
              <PrimaryButton type="submit" disabled={isSubmitting}>
                {isSubmitting ? '생성 중...' : '이벤트 만들기'}
              </PrimaryButton>
            </CreateActionRow>
          </CreateForm>
        </CreateShell>
      ) : (
        <>
          <TopActionRow>
            <AddButton type="button" onClick={() => setIsCreating(true)}>
              <PlusIcon aria-hidden>+</PlusIcon>
              이벤트 추가
            </AddButton>
          </TopActionRow>

          <Grid>
            {events.map((item) => (
              <EventCard key={item.id} type="button" onClick={() => setSelectedEvent(item)}>
                <CardBody>
                  <CardTitle>{item.title}</CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                </CardBody>

                <CardFooter>
                  <span>{item.period}</span>
                  <span>{item.target}</span>
                </CardFooter>
              </EventCard>
            ))}
          </Grid>
        </>
      )}

      {isLoading && <StatusMessage>뉴스 목록을 불러오는 중입니다...</StatusMessage>}
      {!isLoading && events.length === 0 && !statusMessage && (
        <StatusMessage>등록된 뉴스가 없습니다.</StatusMessage>
      )}
      {statusMessage && <StatusMessage>{statusMessage}</StatusMessage>}

      {selectedEvent && (
        <Overlay onClick={() => setSelectedEvent(null)}>
          <DetailModal onClick={(event) => event.stopPropagation()}>
            <CloseButton type="button" onClick={() => setSelectedEvent(null)} aria-label="닫기">
              ‹
            </CloseButton>
            <DetailBody>
              <div>
                <DetailTitle>{selectedEvent.title}</DetailTitle>
                <DetailDescription>{selectedEvent.description}</DetailDescription>
              </div>

              <DetailFooter>
                <span>{selectedEvent.period}</span>
                <span>{selectedEvent.target}</span>
              </DetailFooter>
            </DetailBody>
          </DetailModal>
        </Overlay>
      )}
    </Page>
  );
}

export default EventsPage;
