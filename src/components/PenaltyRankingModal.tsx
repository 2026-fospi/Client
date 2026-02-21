import styled from 'styled-components';
import type { PenaltyRankingItem } from '../api/penalties';

const Overlay = styled.div`
    position: fixed;
    inset: 0;
    z-index: 100;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
`;

const Panel = styled.div`
    width: min(70%, calc(100vw - 40px));
    height: 70%;
    border-radius: 20px;
    background: #ffffff;
    box-shadow: 0 20px 48px rgba(0, 0, 0, 0.2);
    padding: 28px 24px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
`;

const Title = styled.h2`
    margin: 0 0 20px;
    font-size: 18px;
    font-weight: 600;
    text-align: center;
`;

const HeaderRow = styled.div`
    display: grid;
    grid-template-columns: 80px 1fr 160px;
    box-shadow: 0 0 29.5px 2px rgba(0, 0, 0, 0.08);
    border-radius: 14px;
    padding: 12px 20px;
    margin-bottom: 12px;
    color: #64748b;
    font-size: 14px;
    font-weight: 600;
`;

const List = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
    overflow-y: auto;
    height: 100%;
`;

const Row = styled.div<{ $isLoser?: boolean }>`
    display: grid;
    grid-template-columns: 80px 1fr 160px;
    align-items: center;
    padding: 18px 20px;
    border-radius: 14px;

    background: ${({$isLoser}) =>
            $isLoser ? '#f87171' : '#ffffff'};

    color: ${({$isLoser}) =>
            $isLoser ? '#ffffff' : '#111827'};

    box-shadow: 0 0 29.5px 1px rgba(0, 0, 0, 0.08);
    font-weight: ${({$isLoser}) =>
            $isLoser ? 600 : 500};
`;

const Rank = styled.div`
    text-align: center;
`;

const Name = styled.div``;

const Asset = styled.div`
    text-align: right;
    font-variant-numeric: tabular-nums;
`;

function formatAsset(value: string): string {
    const n = parseFloat(value);
    if (Number.isNaN(n)) return value;
    return `${n.toLocaleString('ko-KR')} KRW`;
}

export interface PenaltyRankingModalProps {
    penaltyLabel: string;
    ranking: PenaltyRankingItem[];
    onClose: () => void;
}

export default function PenaltyRankingModal({
                                                penaltyLabel,
                                                ranking,
                                                onClose,
                                            }: PenaltyRankingModalProps) {
    return (
        <Overlay onClick={onClose}>
            <Panel onClick={(e) => e.stopPropagation()}>
                <Title>패널티 : {penaltyLabel}</Title>

                <HeaderRow>
                    <div>순위</div>
                    <div>이름</div>
                    <div style={{ textAlign: 'right' }}>총 자산</div>
                </HeaderRow>

                <List>
                    {ranking.map((row) => (
                        <Row key={row.user_id} $isLoser={row.is_loser}>
                            <Rank>{row.rank}</Rank>
                            <Name>{row.name}</Name>
                            <Asset>{formatAsset(row.total_asset)}</Asset>
                        </Row>
                    ))}
                </List>
            </Panel>
        </Overlay>
    );
}