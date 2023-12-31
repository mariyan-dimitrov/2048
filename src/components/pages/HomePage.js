import styled from 'styled-components';
import { useStoreMe } from 'store-me';

import ControlHandler from '../../handlers/ControlHandler';
import GameHandler from '../../handlers/GameHandler';
import Grid from '../common/Grid';

const HomePage = () => {
  const { tiles } = useStoreMe('tiles');

  return (
    <Wrap>
      <InnerWrap>
        <ControlHandler />
        <GameHandler />
        <Grid />
      </InnerWrap>

      <pre>{JSON.stringify(tiles, null, 2)}</pre>
    </Wrap>
  );
};

export default HomePage;

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
`;

const InnerWrap = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;
