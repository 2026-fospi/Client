import {useEffect, useState} from 'react';
import type {FormEvent} from 'react';
import styled from 'styled-components';
import {createNews, getNews, listUsers} from '../../api';
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

type UserItem = {
    id: number;
    name: string;
    discord_user_id?: string | null;
};

const Page = styled(Flex)`
    width: min(1668px, calc(100vw - 80px));
    margin: 0 auto;
    flex-direction: column;
`;

const TopActionRow = styled(Flex).attrs({row: true, verticalCenter: true})`
    width: min(1020px, 100%);
    margin: 0 auto;
    justify-content: flex-end;
    padding-top: 12px;
    margin-bottom: 40px;
`;

const AddButton = styled.button`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 14px;
    height: 55px;
    padding: 0 26px;
    border: none;
    border-radius: 8px;
    background-color: #fff;
    box-shadow: 0 0 29.5px 2px rgba(0, 0, 0, 0.08);
    font-family: 'Pretendard', sans-serif;
    font-size: 16px;
    font-weight: 500;
    color: #000000;
    cursor: pointer;
`;

const PlusIcon = styled.span`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 25px;
    height: 25px;
    border-radius: 50%;
    color: #111111;ㅍ
    font-size: 22px;
    line-height: 1;
`;

const Grid = styled.div`
    display: grid;
    width: min(1040px, 100%);
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
    min-width: 0;
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
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
`;

const CardDescription = styled.p`
    margin: 0;
    font-family: 'Pretendard', sans-serif;
    font-size: 14px;
    font-weight: 500;
    line-height: 1.4;
    letter-spacing: 0.15px;
    color: #757575;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 6;
    -webkit-box-orient: vertical;
`;

const CardFooter = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    font-family: 'Pretendard', sans-serif;
    font-size: 16px;
    font-weight: 500;
    line-height: 1.4;
    letter-spacing: 0.15px;
    color: #585858;

    span {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    span:first-child {
        flex: 1;
        min-width: 0;
    }

    span:last-child {
        max-width: 42%;
        text-align: right;
    }
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
    width: min(560px, calc(100vw - 40px));
    border-radius: 14px;
    background: #ffffff;
    position: relative;
    padding: 48px 40px 40px;
    box-sizing: border-box;
`;

const CloseButton = styled.button`
    position: absolute;
    left: 16px;
    top: 16px;
    width: 32px;
    height: 32px;
    border: none;
    background: transparent;
    color: #111111;
    font-size: 24px;
    line-height: 1;
    cursor: pointer;
`;

const DetailBody = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`;

const DetailTitle = styled.p`
    margin: 0;
    white-space: pre-wrap;
    font-family: 'Pretendard', sans-serif;
    font-size: 20px;
    line-height: 1.45;
    letter-spacing: 0.02em;
    font-weight: 600;
    color: #000000;
`;

const DetailDescription = styled.p`
    margin: 16px 0 0;
    white-space: pre-wrap;
    font-family: 'Pretendard', sans-serif;
    font-size: 15px;
    line-height: 1.5;
    letter-spacing: 0.02em;
    font-weight: 500;
    color: #575757;
`;

const DetailFooter = styled.div`
    padding-top: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-family: 'Pretendard', sans-serif;
    font-size: 14px;
    line-height: 1.4;
    letter-spacing: 0.02em;
    font-weight: 500;
    color: #757575;
`;

const CreateModalOverlay = styled.div`
    position: fixed;
    inset: 0;
    z-index: 50;
    background: rgba(0, 0, 0, 0.35);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
`;

const CreateModal = styled.div`
    width: min(75vw, calc(100vw - 40px));
    max-height: calc(100vh - 40px);
    border-radius: 14px;
    background: #ffffff;
    box-shadow: 0 16px 36px rgba(0, 0, 0, 0.22);
    padding: 32px 40px 28px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: center;
    margin: auto;
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
    font-size: 16px;
    line-height: 1.4;
    color: #000000;
    box-sizing: border-box;

    &::placeholder {
        font-size: 16px;
        color: #8f8f8f;
    }
`;

const FieldSelectTrigger = styled.button<{ $placeholder?: boolean }>`
    height: 48px;
    border-radius: 8px;
    border: 1px solid #757575;
    background: #ffffff;
    padding: 0 16px;
    font-family: 'Pretendard', sans-serif;
    font-size: ${({$placeholder}) => ($placeholder ? '16px' : '22px')};
    color: ${({$placeholder}) => ($placeholder ? '#8f8f8f' : '#000000')};
    box-sizing: border-box;
    text-align: left;
    cursor: pointer;
`;

const FieldTextArea = styled.textarea`
    height: 200px;
    border-radius: 10px;
    border: 1px solid #757575;
    background: #ffffff;
    padding: 16px 16px;
    font-family: 'Pretendard', sans-serif;
    font-size: 16px;
    line-height: 1.5;
    color: #000000;
    resize: none;
    box-sizing: border-box;

    &::placeholder {
        font-size: 16px;
        color: #8f8f8f;
    }
`;

const CreateActionRow = styled(Flex)`
    align-items: flex-end;
    width: 100%;
    margin-top: 8px;
`;

const PrimaryButton = styled.button`
    width: 35%;
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

const TargetOverlay = styled.div`
    position: fixed;
    inset: 0;
    z-index: 90;
    background: rgba(0, 0, 0, 0.24);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
`;

const TargetModal = styled.div`
    width: min(460px, calc(100vw - 40px));
    max-height: min(620px, calc(100vh - 40px));
    border-radius: 14px;
    background: #ffffff;
    box-shadow: 0 16px 36px rgba(0, 0, 0, 0.22);
    padding: 14px 14px 10px;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
`;

const TargetHeader = styled.div`
    font-family: 'Pretendard', sans-serif;
    font-size: 18px;
    font-weight: 600;
    color: #111111;
    padding: 6px 10px 10px;
`;

const TargetList = styled.div`
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 0 4px 8px;
`;

const TargetItem = styled.button<{ $active?: boolean }>`
    width: 100%;
    border: 1px solid ${({$active}) => ($active ? '#1783ff' : '#e3e6eb')};
    background: ${({$active}) => ($active ? '#eaf4ff' : '#ffffff')};
    border-radius: 10px;
    min-height: 44px;
    padding: 0 14px;
    text-align: left;
    font-family: 'Pretendard', sans-serif;
    font-size: 15px;
    color: #111111;
    cursor: pointer;
`;

const TargetItemRow = styled.span`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
`;

const Check = styled.span<{ $active?: boolean }>`
    width: 18px;
    height: 18px;
    border-radius: 4px;
    border: 1px solid ${({$active}) => ($active ? '#1783ff' : '#c8ced6')};
    background: ${({$active}) => ($active ? '#1783ff' : '#ffffff')};
    color: #ffffff;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
`;

const TargetModalFooter = styled.div`
    border-top: 1px solid #eef1f5;
    padding: 10px 6px 2px;
    display: flex;
    justify-content: space-between;
    gap: 10px;
`;

const TargetCloseButton = styled.button`
    border: none;
    background: transparent;
    color: #4b5563;
    font-family: 'Pretendard', sans-serif;
    font-size: 14px;
    cursor: pointer;
`;

const TargetApplyButton = styled.button`
    border: none;
    background: #1783ff;
    color: #ffffff;
    font-family: 'Pretendard', sans-serif;
    font-size: 14px;
    border-radius: 8px;
    height: 34px;
    min-width: 64px;
    padding: 0 12px;
    cursor: pointer;
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

function mapNewsToCard(item: NewsApiItem, users: UserItem[]): EventCardItem {
    const matchedUser = users.find((user) => user.id === item.related_user_id);
    return {
        id: String(item.id),
        title: item.title,
        description: item.content,
        period: formatDateLabel(item.created_at),
        target: item.related_user_id === null ? '전체' : matchedUser?.name ?? `유저 #${item.related_user_id}`,
    };
}

function EventsPage() {
    const [events, setEvents] = useState<EventCardItem[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<EventCardItem | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [selectedTargetUserIds, setSelectedTargetUserIds] = useState<number[]>([]);
    const [isAllTargetSelected, setIsAllTargetSelected] = useState(false);
    const [newDescription, setNewDescription] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');
    const [users, setUsers] = useState<UserItem[]>([]);
    const [isTargetModalOpen, setIsTargetModalOpen] = useState(false);

    const targetLabel =
        isAllTargetSelected
            ? '전체'
            : selectedTargetUserIds.length === 0
                ? '대상을 선택하세요.'
                : (() => {
                    const names = users
                        .filter((user) => selectedTargetUserIds.includes(user.id))
                        .map((user) => user.name);
                    if (names.length === 0) return '대상을 선택하세요.';
                    if (names.length === 1) return names[0];
                    return `${names[0]} 외 ${names.length - 1}명 선택됨`;
                })();

    useEffect(() => {
        async function loadUsers() {
            try {
                const response = await listUsers();
                setUsers(response);
            } catch {
                setUsers([]);
            }
        }

        void loadUsers();
    }, []);

    useEffect(() => {
        async function loadNews() {
            setIsLoading(true);
            setStatusMessage('');

            try {
                const response = await getNews();
                setEvents(response.map((item) => mapNewsToCard(item, users)));
            } catch (error) {
                const message = error instanceof Error ? error.message : '뉴스 목록을 불러오지 못했습니다.';
                setStatusMessage(message);
            } finally {
                setIsLoading(false);
            }
        }

        void loadNews();
    }, [users]);

    async function handleCreateEvent(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!newTitle.trim() || !newDescription.trim()) {
            setStatusMessage('제목과 내용을 입력해 주세요.');
            return;
        }

        setIsSubmitting(true);
        setStatusMessage('');

        try {
            const targetIds = isAllTargetSelected
                ? [null]
                : selectedTargetUserIds.length > 0
                    ? selectedTargetUserIds
                    : [null];

            const createdList = await Promise.all(
                targetIds.map((targetId) =>
                    createNews({
                        event_description: `[${newTitle.trim()}] ${newDescription.trim()}`,
                        related_user_id: targetId,
                    })
                )
            );

            const mappedList = createdList.map((created) => mapNewsToCard(created, users));
            setEvents((prev) => [...mappedList, ...prev]);
            setIsCreating(false);
            setSelectedEvent(mappedList[0] ?? null);
            setNewTitle('');
            setNewDescription('');
            setSelectedTargetUserIds([]);
            setIsAllTargetSelected(false);
        } catch (error) {
            const message = error instanceof Error ? error.message : '뉴스 추가 중 오류가 발생했습니다.';
            setStatusMessage(message);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Page>
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

            {isCreating && (
                <CreateModalOverlay onClick={() => setIsCreating(false)}>
                    <CreateModal onClick={(e) => e.stopPropagation()}>
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
                                <FieldSelectTrigger
                                    type="button"
                                    $placeholder={!isAllTargetSelected && selectedTargetUserIds.length === 0}
                                    onClick={() => setIsTargetModalOpen(true)}
                                >
                                    {targetLabel}
                                </FieldSelectTrigger>
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
                    </CreateModal>
                </CreateModalOverlay>
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

            {isTargetModalOpen && (
                <TargetOverlay onClick={() => setIsTargetModalOpen(false)}>
                    <TargetModal onClick={(event) => event.stopPropagation()}>
                        <TargetHeader>대상을 선택하세요.</TargetHeader>
                        <TargetList>
                            <TargetItem
                                type="button"
                                $active={isAllTargetSelected}
                                onClick={() => {
                                    setIsAllTargetSelected((prev) => {
                                        const next = !prev;
                                        if (next) {
                                            setSelectedTargetUserIds([]);
                                        }
                                        return next;
                                    });
                                }}
                            >
                                <TargetItemRow>
                                    <span>전체</span>
                                    <Check $active={isAllTargetSelected}>{isAllTargetSelected ? '✓' : ''}</Check>
                                </TargetItemRow>
                            </TargetItem>

                            {users.map((user) => (
                                <TargetItem
                                    key={user.id}
                                    type="button"
                                    $active={selectedTargetUserIds.includes(user.id)}
                                    onClick={() => {
                                        setIsAllTargetSelected(false);
                                        setSelectedTargetUserIds((prev) =>
                                            prev.includes(user.id) ? prev.filter((id) => id !== user.id) : [...prev, user.id]
                                        );
                                    }}
                                >
                                    <TargetItemRow>
                                        <span>{user.name}</span>
                                        <Check $active={selectedTargetUserIds.includes(user.id)}>
                                            {selectedTargetUserIds.includes(user.id) ? '✓' : ''}
                                        </Check>
                                    </TargetItemRow>
                                </TargetItem>
                            ))}
                        </TargetList>

                        <TargetModalFooter>
                            <TargetCloseButton type="button" onClick={() => setIsTargetModalOpen(false)}>
                                닫기
                            </TargetCloseButton>
                            <TargetApplyButton type="button" onClick={() => setIsTargetModalOpen(false)}>
                                확인
                            </TargetApplyButton>
                        </TargetModalFooter>
                    </TargetModal>
                </TargetOverlay>
            )}
        </Page>
    );
}

export default EventsPage;
