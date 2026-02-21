import styled from 'styled-components';
import Flex from '../../../components/common/Flex';
import { useExchangePage } from './exchangePageContext';

const EventsSection = styled(Flex)`
  padding: 20px;
  background: #fff;
`;

const EventsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;

  th,
  td {
    padding: 12px 16px;
    text-align: left;
    border-bottom: 1px solid #e5e7eb;
  }

  th {
    font-weight: 600;
    color: #64748b;
    background: #f8fafc;
  }
`;

export default function EventsTab() {
  const { events } = useExchangePage();

  return (
    <EventsSection>
      <EventsTable>
        <thead>
          <tr>
            <th>거래 일시</th>
            <th>타입</th>
            <th>변동가</th>
          </tr>
        </thead>
        <tbody>
          {events.map((ev) => (
            <tr key={ev.id}>
              <td>{ev.dateTime}</td>
              <td>{ev.type}</td>
              <td style={{ color: ev.priceChange.startsWith('+') ? '#ef4444' : '#2563eb' }}>
                {ev.priceChange}
              </td>
            </tr>
          ))}
        </tbody>
      </EventsTable>
    </EventsSection>
  );
}
