import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { createRoom, joinRoom } from '../api';
import wallpaper from '../assets/login-wallpaper.jpg';

const Viewport = styled.div`
  width: 100%;
  min-height: 100dvh;
  height: 100dvh;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: #ffffff;
`;

const Background = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
`;

const BackgroundRotate = styled.div`
  transform: rotate(90deg);
`;

const BackgroundImage = styled.img`
  width: 1080px;
  height: 1920px;
  object-fit: cover;
  user-select: none;
`;

const Card = styled.div<{ $scale: number }>`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%) scale(${({ $scale }) => $scale});
  transform-origin: center center;
  width: 893px;
  height: 1000px;
  border-radius: 60px;
  background: #ffffff;
  box-shadow: 0 0 29.5px 2px rgba(0, 0, 0, 0.08);
  padding: 92px 80px 86px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
`;

const CodeCard = styled.div<{ $scale: number }>`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%) scale(${({ $scale }) => $scale});
  transform-origin: center center;
  width: 953px;
  height: 512px;
  border-radius: 60px;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 56px;
  box-sizing: border-box;
`;

const Logo = styled.div`
  font-family: 'Hakgyoansim Allimjang OTF', 'Pretendard', sans-serif;
  text-align: center;
  font-size: 58px;
  line-height: 1;
  font-weight: 700;
  color: #1783ff;
`;

const Title = styled.h1`
  margin: 0;
  margin-top: 26px;
  font-family: 'Pretendard', sans-serif;
  text-align: center;
  font-size: 40px;
  line-height: 1.2;
  font-weight: 600;
  color: #000;
`;

const Description = styled.p`
  margin: 0;
  margin-top: 12px;
  font-family: 'Pretendard', sans-serif;
  text-align: center;
  font-size: 20px;
  font-weight: 500;
  line-height: 1.35;
  color: #585858;
`;

const Form = styled.form`
  margin-top: 44px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Center = styled.div`
  width: min(732px, 100%);
  margin: 0 auto;
`;

const Narrow = styled.div`
  width: min(549px, 100%);
  margin: 0 auto;
`;

const ModeTabs = styled.div`
  background: #e2f2ff;
  border-radius: 12px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  overflow: hidden;
`;

const ModeTab = styled.button<{ $active?: boolean }>`
  height: 74px;
  border: none;
  background: ${({ $active }) => ($active ? '#1783ff' : '#e2f2ff')};
  color: ${({ $active }) => ($active ? '#ffffff' : '#757575')};
  font-family: 'Pretendard', sans-serif;
  font-size: 24px;
  font-weight: 500;
  cursor: pointer;
`;

const Field = styled.label`
  display: flex;
  flex-direction: column;
  gap: 7px;
`;

const Label = styled.span`
  font-family: 'Pretendard', sans-serif;
  font-size: 24px;
  font-weight: 500;
  color: #000000;
`;

const Input = styled.input`
  height: 74px;
  border-radius: 12px;
  border: 1px solid #757575;
  background: #ffffff;
  padding: 0 24px;
  font-family: 'Pretendard', sans-serif;
  font-size: 22px;
  font-weight: 500;
  color: #000000;
  outline: none;
  box-sizing: border-box;

  &:focus {
    border-color: #1783ff;
    box-shadow: 0 0 0 4px rgba(23, 131, 255, 0.14);
  }
`;

const DateRange = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const DateInput = styled(Input)`
  width: 244px;
  text-align: center;
  padding: 0 10px;
`;

const Tilde = styled.span`
  font-family: 'Pretendard', sans-serif;
  font-size: 32px;
  line-height: 1;
  color: #000000;
`;

const ActionRow = styled.div`
  margin-top: 17px;
  width: min(497px, 100%);
  margin-left: auto;
  margin-right: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const WideActionRow = styled(ActionRow)`
  width: min(732px, 100%);
`;

const Submit = styled.button`
  width: 100%;
  height: 82px;
  border: 0;
  border-radius: 12px;
  background: #1783ff;
  color: #fff;
  font-family: 'Pretendard', sans-serif;
  font-size: 24px;
  font-weight: 500;
  cursor: pointer;

  &:active {
    transform: translateY(1px);
  }
`;

const CodeBrand = styled.p`
  margin: 0;
  font-family: 'Hakgyoansim Allimjang OTF', 'Pretendard', sans-serif;
  color: #004edf;
  font-size: 58px;
  font-weight: 700;
  line-height: 1;
`;

const CodeLabel = styled.p`
  margin: 36px 0 0;
  font-family: 'Pretendard', sans-serif;
  color: #000000;
  font-size: 26px;
  font-weight: 600;
  line-height: 1;
`;

const DiscordLink = styled.button`
  margin-top: 56px;
  border: none;
  background: transparent;
  padding: 0;
  font-family: 'Pretendard', sans-serif;
  color: #40a6ff;
  font-size: 20px;
  font-weight: 500;
  text-decoration: underline;
  cursor: pointer;
`;

const CodeValue = styled.p`
  margin: 24px 0 0;
  font-family: 'Pretendard', sans-serif;
  color: #000000;
  font-size: 46px;
  font-weight: 700;
  line-height: 1;
  letter-spacing: 0.06em;
`;

const StartButton = styled.button`
  margin-top: 72px;
  width: 199px;
  height: 56px;
  border: none;
  border-radius: 12px;
  background: #e2f2ff;
  font-family: 'Pretendard', sans-serif;
  color: #000000;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
`;

const DISCORD_BOT_INVITE_URL =
  'https://discord.com/oauth2/authorize?client_id=1474719711676731452&permissions=66624&integration_type=0&scope=bot';

const ErrorMessage = styled.p`
  margin: 0;
  text-align: center;
  font-family: 'Pretendard', sans-serif;
  font-size: 16px;
  color: #d73333;
`;

function toStartIso(date: string): string | null {
  if (!date.trim()) {
    return null;
  }

  return `${date}T00:00:00Z`;
}

function toEndIso(date: string): string | null {
  if (!date.trim()) {
    return null;
  }

  return `${date}T23:59:59Z`;
}

function CreatePage() {
  const navigate = useNavigate();
  const [scale, setScale] = useState(1);
  const [mode, setMode] = useState<'create' | 'join'>('join');
  const [createStep, setCreateStep] = useState<'create' | 'penalty' | 'code'>('create');
  const [joinCode, setJoinCode] = useState('123456');
  const [roomTitle, setRoomTitle] = useState('FOSPI 모임');
  const [startDate, setStartDate] = useState('2023-06-10');
  const [endDate, setEndDate] = useState('2023-06-10');
  const [penaltyContent, setPenaltyContent] = useState('');
  const [generatedCode, setGeneratedCode] = useState('123456');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const isPenaltyScreen = mode === 'create' && createStep === 'penalty';
  const isCodeScreen = mode === 'create' && createStep === 'code';

  const cardSize = useMemo(
    () => (isCodeScreen ? { width: 953, height: 512 } : { width: 893, height: 1000 }),
    [isCodeScreen]
  );

  useEffect(() => {
    const updateScale = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const horizontalPadding = 20;
      const verticalPadding = 20;
      const nextScale = Math.min(
        (w - horizontalPadding) / cardSize.width,
        (h - verticalPadding) / cardSize.height,
        1
      );
      setScale(nextScale);
    };

    updateScale();
    window.addEventListener('resize', updateScale);

    return () => {
      window.removeEventListener('resize', updateScale);
    };
  }, [cardSize]);

  async function handleSubmitAsync(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage('');

    if (mode === 'join') {
      if (!joinCode.trim()) {
        setErrorMessage('참여코드를 입력해 주세요.');
        return;
      }

      setIsSubmitting(true);

      try {
        await joinRoom({ room_code: joinCode.trim() });
        navigate('/exchange');
      } catch (error) {
        const message = error instanceof Error ? error.message : '방 참여 중 오류가 발생했습니다.';
        setErrorMessage(message);
      } finally {
        setIsSubmitting(false);
      }

      return;
    }

    if (createStep === 'create') {
      setCreateStep('penalty');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await createRoom({
        title: roomTitle.trim() || 'FOSPI 모임',
        penalties: penaltyContent.trim() ? [penaltyContent.trim()] : [],
        start_date: toStartIso(startDate),
        end_date: toEndIso(endDate),
      });

      setGeneratedCode(response.room_code);
      setCreateStep('code');
    } catch (error) {
      const message = error instanceof Error ? error.message : '방 생성 중 오류가 발생했습니다.';
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Viewport>
      <Background aria-hidden>
        <BackgroundRotate>
          <BackgroundImage src={wallpaper} alt="" />
        </BackgroundRotate>
      </Background>

      {isCodeScreen ? (
        <CodeCard $scale={scale}>
          <CodeBrand>FOSPI</CodeBrand>
          <CodeLabel>참여 코드</CodeLabel>
          <DiscordLink
            type="button"
            onClick={() => window.open(DISCORD_BOT_INVITE_URL, '_blank', 'noopener,noreferrer')}
          >
            디스코드 봇을 추가해주세요
          </DiscordLink>
          <CodeValue>{generatedCode}</CodeValue>
          <StartButton type="button" onClick={() => navigate('/room-select')}>
            시작하기
          </StartButton>
        </CodeCard>
      ) : (
        <Card $scale={scale}>
            <Logo>FOSPI</Logo>
            <Title>{isPenaltyScreen ? '패널티를 설정 해주세요' : '참여 방식 선택'}</Title>
            {!isPenaltyScreen && (
              <Description>
                {mode === 'create'
                  ? '이미 공유받은 참여 코드가 있다면 입력 후 [참여하기]를 눌러주세요.'
                  : '새로운 모임을 시작하고 싶다면 [생성하기]를 눌러주세요.'}
              </Description>
            )}

            <Form onSubmit={handleSubmitAsync}>
              {!isPenaltyScreen && (
                <Center>
                  <ModeTabs>
                    <ModeTab
                      type="button"
                      $active={mode === 'create'}
                  onClick={() => {
                    setMode('create');
                    setCreateStep('create');
                  }}
                    >
                      생성하기
                    </ModeTab>
                    <ModeTab
                      type="button"
                      $active={mode === 'join'}
                      onClick={() => {
                        setMode('join');
                        setCreateStep('create');
                      }}
                    >
                      참여하기
                    </ModeTab>
                  </ModeTabs>
                </Center>
              )}

              {mode === 'join' && (
                <Center>
                  <Field>
                    <Label>참여코드</Label>
                    <Input
                      type="text"
                      value={joinCode}
                      onChange={(event) => setJoinCode(event.target.value)}
                      placeholder="참여코드를 입력하세요"
                    />
                  </Field>
                </Center>
              )}

              {mode === 'create' && (
                <Narrow>
                  <Field>
                    <Label>방 제목</Label>
                    <Input
                      type="text"
                      value={roomTitle}
                      onChange={(event) => setRoomTitle(event.target.value)}
                      placeholder="방 제목을 입력하세요"
                    />
                  </Field>

                  <Field>
                    <Label>페널티 기간</Label>
                    <DateRange>
                      <DateInput
                        type="text"
                        value={startDate}
                        onChange={(event) => setStartDate(event.target.value)}
                        placeholder="2023-06-10"
                      />
                      <Tilde>~</Tilde>
                      <DateInput
                        type="text"
                        value={endDate}
                        onChange={(event) => setEndDate(event.target.value)}
                        placeholder="2023-06-10"
                      />
                    </DateRange>
                  </Field>

                  <Field>
                    <Label>패널티 내용</Label>
                    <Input
                      type="text"
                      value={penaltyContent}
                      onChange={(event) => setPenaltyContent(event.target.value)}
                      placeholder="해당 방에서 사용 할 페널티의 내용을 작성해주세요."
                    />
                  </Field>
                </Narrow>
              )}

              {isPenaltyScreen ? (
                <WideActionRow>
                  <Submit type="submit" disabled={isSubmitting}>
                    {isSubmitting ? '처리 중...' : '추가하기'}
                  </Submit>
                </WideActionRow>
              ) : (
                <ActionRow>
                  <Submit type="submit" disabled={isSubmitting}>
                    {isSubmitting ? '처리 중...' : mode === 'join' ? '참여하기' : '생성하기'}
                  </Submit>
                </ActionRow>
              )}
              {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
            </Form>
        </Card>
      )}
    </Viewport>
  );
}

export default CreatePage;
