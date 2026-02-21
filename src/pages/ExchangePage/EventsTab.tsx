import { useEffect, useState } from 'react';
import styled from 'styled-components';
import Flex from '../../../components/common/Flex';
import { useExchangePage } from './exchangePageContext';
import { getStockLogs } from '../../api/stock';
import type { StockLogItem } from '../../api/stock';

const EventsSection = styled(Flex)`
  padding: 20px 50px;
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

function formatRecordedAt(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

function formatChangeAmount(amount: string): string {
  const n = parseFloat(amount);
  if (n > 0) return `+${amount}`;
  if (n < 0) return amount;
  return '0';
}

export default function EventsTab() {
  const { selectedMemberId } = useExchangePage();
  const [logs, setLogs] = useState<StockLogItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const stockId = Number(selectedMemberId);
    if (Number.isNaN(stockId) || selectedMemberId === '') {
      return;
    }

    let cancelled = false;

    getStockLogs(stockId)
      .then((data) => {
        if (!cancelled) {
          setError(null);
          setLogs(Array.isArray(data) ? data : []);
        }
      })
      .catch((e) => {
        if (cancelled) return;
        const msg = e instanceof Error ? e.message : String(e);
        if (msg.includes('404') || msg.includes('Not Found')) {
          setLogs([]);
          setError(null);
        } else {
          setError('변동 로그를 불러오지 못했습니다.');
          setLogs([]);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [selectedMemberId]);

  return (
    <EventsSection>
      <EventsTable>
        <thead>
          <tr>
            <th>거래 일시</th>
            <th>본문</th>
            <th>타입</th>
            <th>변동가</th>
          </tr>
        </thead>
        <tbody>
          {error && (
            <tr>
              <td colSpan={4} style={{ textAlign: 'center', color: '#dc2626', padding: 24 }}>
                {error}
              </td>
            </tr>
          )}
          {!error && logs.length === 0 && (
            <tr>
              <td colSpan={4} style={{ textAlign: 'center', color: '#94a3b8', padding: 32 }}>
                변동 로그가 없습니다.
              </td>
            </tr>
          )}
          {!error &&
            logs.map((log, i) => (
              <tr key={`${log.recorded_at}-${i}`}>
                <td>{formatRecordedAt(log.recorded_at)}</td>
                <td>{log.content || '-'}</td>
                <td>{log.log_type}</td>
                <td
                  style={{
                    color:
                      parseFloat(log.change_amount) > 0
                        ? '#ef4444'
                        : parseFloat(log.change_amount) < 0
                          ? '#2563eb'
                          : '#64748b',
                  }}
                >
                  {formatChangeAmount(log.change_amount)}
                </td>
              </tr>
            ))}
        </tbody>
      </EventsTable>
    </EventsSection>
  );
}
