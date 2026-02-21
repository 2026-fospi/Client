import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import {
  LoginPage,
  SignupPage,
  ExchangePage,
  HoldingsPage,
  EventsPage,
  MyPage,
} from './pages';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/exchange" replace />} />
          <Route path="exchange" element={<ExchangePage />} />
          <Route path="holdings" element={<HoldingsPage />} />
          <Route path="events" element={<EventsPage />} />
          <Route path="mypage" element={<MyPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
