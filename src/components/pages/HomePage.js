import { setStoreMe, useStoreMe } from 'store-me';
import styled from 'styled-components';

import generalStyles from '../../_constants/generalStyles';
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
            <ScoreDisplay title="Best:" score={Math.max(highScore, score)} />
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
  margin-bottom: ${generalStyles.spacing_16};
`;

const SmallButton = styled(Button)`
  padding: ${generalStyles.spacing_8};
  margin-bottom: ${generalStyles.spacing_8};
`;
