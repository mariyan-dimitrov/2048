import styled from 'styled-components';
import Grid from '../common/Grid';
import ControlHandler from '../../handlers/ControlHandler';
import GameHandler from '../../handlers/GameHandler';
import { useStoreMe } from 'store-me';

const Dashboard = () => {
  const { tiles } = useStoreMe('tiles');

  return (
    <div>
      <Wrap>
        <ControlHandler />
        <GameHandler />
        <Grid />
      </Wrap>

      <pre>{JSON.stringify(tiles, null, 2)}</pre>
    </div>
  );
};

export default Dashboard;

const Wrap = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;
