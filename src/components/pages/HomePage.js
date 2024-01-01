import { setStoreMe, useStoreMe } from 'store-me';
import styled from 'styled-components';

import ScoreDisplay from '../common/ScoreDisplay';
import Button from '../common/Button';
import Grid from '../common/Grid';

const HomePage = () => {
  const { highScore, score } = useStoreMe('highScore', 'score');

  return (
    <Wrap>
      <InnerWrap>
        <GameWrap>
          <ScoresWrap>
            <ScoreDisplay title="Best:" score={highScore} />
            <ScoreDisplay title="Score:" score={score} />
          </ScoresWrap>

          <SmallButton text="Start new game" onClick={() => setStoreMe({ shouldStartNewGame: true })} />

          <Grid />
        </GameWrap>
      </InnerWrap>
    </Wrap>
  );
};

export default HomePage;

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const InnerWrap = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const GameWrap = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const ScoresWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 350px;
  margin-bottom: 16px;
`;

const SmallButton = styled(Button)`
  padding: 8px;
  margin-bottom: 8px;
`;
