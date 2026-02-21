import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import {
  LoginPage,
  SignupPage,
  CreatePage,
  RoomSelectPage,
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
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/create" element={<CreatePage />} />
        <Route element={<Layout />}>
          <Route path="exchange" element={<ExchangePage />} />
          <Route path="room-select" element={<RoomSelectPage />} />
          <Route path="holdings" element={<HoldingsPage />} />
          <Route path="events" element={<EventsPage />} />
          <Route path="mypage" element={<MyPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
