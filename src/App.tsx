import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import {
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
        <Route path="/" element={<Layout />}>
          <Route index element={<ExchangePage />} />
          <Route path="holdings" element={<HoldingsPage />} />
          <Route path="events" element={<EventsPage />} />
          <Route path="mypage" element={<MyPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
