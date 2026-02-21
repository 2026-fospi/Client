import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { login, saveAccessToken } from '../api';
import AuthBox from '../components/auth/AuthBox';
import wallpaper from '../assets/login-wallpaper.jpg';

const Page = styled.div`
  min-height: 100vh;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 16px;
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

const Card = styled(AuthBox)`
  gap: 20px;

  @media (max-width: 540px) {
    width: 100%;
    min-height: calc(100vh - 4px);
    border-radius: 32px;
    padding: 44px 24px 38px;
  }
`;

const Logo = styled.div`
  text-align: center;
  font-size: 46px;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: #1783ff;
`;

const Title = styled.h1`
  margin: 0;
  text-align: center;
  font-size: 38px;
  font-weight: 700;
  color: #000;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-top: 14px;
  flex: 1;
`;

const Field = styled.label`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const LabelText = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #000;
`;

const Input = styled.input`
  height: 42px;
  border-radius: 8px;
  border: 1px solid #9da4af;
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
  flex-direction: column;
  gap: 12px;
  align-items: center;
`;

const LinkButton = styled.button`
  border: 0;
  background: transparent;
  padding: 0;
  font-size: 14px;
  font-weight: 500;
  color: #757575;
  cursor: pointer;
`;

const Submit = styled.button`
  width: 100%;
  height: 50px;
  border: 0;
  border-radius: 8px;
  background: #1783ff;
  color: #fff;
  font-size: 17px;
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

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email || !password) {
      window.alert('이메일과 비밀번호를 입력해 주세요.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await login({ email, password });
      saveAccessToken(response.access_token);
      navigate('/create');
    } catch (error) {
      const message = error instanceof Error ? error.message : '로그인 중 오류가 발생했습니다.';
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
        <Title>로그인</Title>

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
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </Field>

          <Actions>
            <LinkButton type="button" onClick={() => navigate('/signup')}>
              회원가입
            </LinkButton>
            <Submit type="submit" disabled={isSubmitting}>
              {isSubmitting ? '로그인 중...' : '로그인'}
            </Submit>
          </Actions>
        </Form>
      </Card>
    </Page>
  );
}

export default LoginPage;
