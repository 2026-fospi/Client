export type TabId = 'quote' | 'events';

export interface ExchangeMember {
  id: string;
  name: string;
  currentPrice: number;
  changePercent: number;
}

export interface ExchangeEvent {
  id: string;
  dateTime: string;
  content: string;
  type: string;
  priceChange: string;
}

// Mock (연동 후 API로 대체)
export const MOCK_MEMBERS: ExchangeMember[] = [
  { id: 'me', name: '내 주식', currentPrice: 12500, changePercent: 2.34 },
  { id: '1', name: '친구A 주식', currentPrice: 8300, changePercent: -0.52 },
  { id: '2', name: '친구B 주식', currentPrice: 15200, changePercent: 5.12 },
  { id: '3', name: '친구C 주식', currentPrice: 4200, changePercent: -1.22 },
];

export const MOCK_EVENTS: ExchangeEvent[] = [
  { id: '1', dateTime: '2026-02-21 14:32', content: "홍길동, 독보적 활약으로 주가 급등!", type: '이벤트', priceChange: '+1,200' },
  { id: '2', dateTime: '2026-02-21 14:28', content: "홍길동, 독보적 활약으로 주가 급등!", type: '채팅', priceChange: '-500' },
  { id: '3', dateTime: '2026-02-21 14:15', content: "홍길동, 독보적 활약으로 주가 급등!", type: '이벤트', priceChange: '+800' },
];
