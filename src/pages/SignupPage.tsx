import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import wallpaper from '../assets/login-wallpaper.jpg';

const Page = styled.div`
  min-height: 100vh;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 18px 20px;
  overflow: hidden;

  @media (max-width: 540px) {
    padding: 2px;
  }
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
  width: 100vh;
  height: 100vw;
  object-fit: cover;
  user-select: none;
`;

const Card = styled.div`
  position: relative;
  width: min(446px, 100%);
  min-height: min(520px, calc(100vh - 36px));
  border-radius: 34px;
  background: rgba(232, 236, 244, 0.92);
  box-shadow: 0 0 29.5px 2px rgba(0, 0, 0, 0.08);
  padding: 32px 32px 18px;
  display: flex;
  flex-direction: column;
  gap: 12px;

  @media (max-width: 540px) {
    width: 100%;
    min-height: calc(100vh - 4px);
    padding: 24px 30px 18px;
  }
`;

const Logo = styled.div`
  text-align: center;
  font-size: 48px;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: #1783ff;
`;

const Title = styled.h1`
  margin: 0;
  text-align: center;
  font-size: 37px;
  font-weight: 700;
  color: #000;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 9px;
  margin-top: 10px;
  flex: 1;
`;

const Field = styled.label`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const LabelText = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #000;
`;

const Input = styled.input`
  height: 37px;
  border-radius: 7px;
  border: 1px solid #a2a9b3;
  background: transparent;
  padding: 0 12px;
  font-size: 16px;
  outline: none;

  &:focus {
    border-color: #1783ff;
    box-shadow: 0 0 0 4px rgba(23, 131, 255, 0.14);
  }
`;

const Actions = styled.div`
  margin-top: auto;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Submit = styled.button`
  width: 100%;
  height: 42px;
  border: 0;
  border-radius: 7px;
  background: #1783ff;
  color: #fff;
  font-size: 18px;
  font-weight: 500;
  cursor: pointer;

  &:active {
    transform: translateY(1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

function SignupPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email || !password || !passwordConfirm || !name) {
      window.alert('모든 항목을 입력해 주세요.');
      return;
    }

    if (password.length < 6) {
      window.alert('비밀번호는 6자 이상이어야 합니다.');
      return;
    }

    if (password !== passwordConfirm) {
      window.alert('비밀번호 확인이 일치하지 않습니다.');
      return;
    }

    setIsSubmitting(true);

    try {
      window.alert('회원가입 성공');
      navigate('/login');
    } catch (error) {
      const message = error instanceof Error ? error.message : '회원가입 중 오류가 발생했습니다.';
      window.alert(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Page>
      <Background aria-hidden>
        <BackgroundRotate>
          <BackgroundImage src={wallpaper} alt="" />
        </BackgroundRotate>
      </Background>

      <Card>
        <Logo>FOSPI</Logo>
        <Title>회원가입</Title>

        <Form onSubmit={handleSubmit}>
          <Field>
            <LabelText>이메일</LabelText>
            <Input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </Field>

          <Field>
            <LabelText>비밀번호</LabelText>
            <Input
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </Field>

          <Field>
            <LabelText>비밀번호 확인</LabelText>
            <Input
              type="password"
              autoComplete="new-password"
              value={passwordConfirm}
              onChange={(event) => setPasswordConfirm(event.target.value)}
            />
          </Field>

          <Field>
            <LabelText>이름</LabelText>
            <Input
              type="text"
              autoComplete="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </Field>

          <Actions>
            <Submit type="submit" disabled={isSubmitting}>
              {isSubmitting ? '처리 중...' : '회원가입'}
            </Submit>
          </Actions>
        </Form>
      </Card>
    </Page>
  );
}

export default SignupPage;
