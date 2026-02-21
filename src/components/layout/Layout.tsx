import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import Flex from '../common/Flex';
import Navbar from './Navbar';
import PenaltyRankingModal from '../PenaltyRankingModal';
import { getPenaltiesLoser } from '../../api/penalties';
import type { PenaltiesLoserResponse } from '../../api/penalties';
import { getRoomEndDate } from '../../api/auth';

const LayoutContainer = styled(Flex).attrs({
  width: '100%',
})`
  min-height: 100vh;
  flex-direction: column;
`;

const Content = styled(Flex).attrs({ flex: 1 })`
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;
`;

function Layout() {
  const [penaltyData, setPenaltyData] = useState<PenaltiesLoserResponse | null>(null);

  useEffect(() => {
    const endDateStr = getRoomEndDate();
    if (endDateStr) {
      const end = new Date(endDateStr).getTime();
      if (Number.isNaN(end) || Date.now() < end) {
        return;
      }
    }

    let cancelled = false;
    getPenaltiesLoser()
      .then((res) => {
        if (cancelled) return;
        if (res?.ranking?.length) {
          setPenaltyData(res);
        }
      })
      .catch(() => {
        if (!cancelled) setPenaltyData(null);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <LayoutContainer>
      <header style={{ flexShrink: 0 }}>
        <Navbar />
      </header>
      <Content as="main">
        <Outlet />
      </Content>
      {penaltyData && (
        <PenaltyRankingModal
          penaltyLabel={penaltyData.penalties?.[0] ?? '벌칙'}
          ranking={penaltyData.ranking}
          onClose={() => setPenaltyData(null)}
        />
      )}
    </LayoutContainer>
  );
}

export default Layout;
