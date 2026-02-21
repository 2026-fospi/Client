import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { login, saveAccessToken } from '../../api';
import Flex from '../../../components/common/Flex';

const Page = styled(Flex).attrs({
  width: '100%',
})`
  min-height: 100vh;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1e3a5f 0%, #2563eb 40%, #3b82f6 70%, #93c5fd 100%);
  background-size: 400% 400%;
  animation: gradientShift 12s ease infinite;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.15) 0%, transparent 50%),
                radial-gradient(ellipse at 70% 80%, rgba(255,255,255,0.08) 0%, transparent 40%);
    pointer-events: none;
  }

  @keyframes gradientShift {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }
`;

const Card = styled(Flex)`
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 400px;
  padding: 2.5rem 2rem;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 24px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.2);
  flex-direction: column;
  align-items: stretch;
  gap: 24px;
`;

const Logo = styled.span`
  font-size: 28px;
  font-weight: 700;
  color: #1e3a5f;
  text-align: center;
  letter-spacing: -0.02em;
`;

const Title = styled.span`
  font-size: 18px;
  font-weight: 500;
  color: #374151;
  text-align: center;
`;

const Field = styled(Flex)`
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 14px;
  color: #374151;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 14px;
  font-size: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background: #fff;
  box-sizing: border-box;
  outline: none;
  transition: border-color 0.2s;

  &::placeholder {
    color: #9ca3af;
  }
  &:focus {
    border-color: #2563eb;
  }
`;

const SignUpLink = styled.button`
  background: none;
  border: none;
  font-size: 14px;
  color: #374151;
  cursor: pointer;
  padding: 0;
  text-align: center;
  text-decoration: underline;
  text-underline-offset: 2px;

  &:hover {
    color: #1e3a5f;
  }
`;

const LoginButton = styled.button`
  width: 100%;
  padding: 14px 24px;
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  background: #2563eb;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #1d4ed8;
  }
  &:active {
    background: #1e40af;
  }
`;

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      return;
    }

    const response = await login({ email, password });
    saveAccessToken(response.access_token);
    navigate('/exchange');
  };

  const handleSignUp = () => {
    navigate('/signup');
  };

  return (
    <Page>
      <Card as="form" onSubmit={handleSubmit}>
        <Logo>FOSPI</Logo>
        <Title>로그인</Title>

        <Field>
          <Label htmlFor="email">이메일</Label>
          <Input
            id="email"
            type="email"
            placeholder="이메일을 입력하세요"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </Field>

        <Field>
          <Label htmlFor="password">비밀번호</Label>
          <Input
            id="password"
            type="password"
            placeholder="비밀번호를 입력하세요"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </Field>

        <SignUpLink type="button" onClick={handleSignUp}>
          회원가입
        </SignUpLink>

        <LoginButton type="submit">로그인</LoginButton>
      </Card>
    </Page>
  );
}

export default LoginPage;
