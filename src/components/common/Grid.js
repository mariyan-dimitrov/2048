import styled from 'styled-components';
import { useStoreMe } from 'store-me';

import generalStyles from '../../_constants/generalStyles';
import CONFIG from '../../_constants/config';
import Tile from './Tile';

const Grid = () => {
  const { gameOver, tiles } = useStoreMe('gameOver', 'tiles');

  return (
    <Wrap>
      <InnerWrap>
        {[...Array(CONFIG.gridSize)].map((_, x) => (
          <div key={x}>
            {[...Array(CONFIG.gridSize)].map((_, y) => (
              <Tile x={x} y={y} key={`${x}-${y}`} />
            ))}
          </div>
        ))}

        {tiles.map(tile => {
          const { x, y, value, id, goingToMergeIntoId, idBeingMerged } = tile;

          return (
            <Tile
              x={x}
              y={y}
              key={id}
              value={value}
              goingToMergeIntoId={goingToMergeIntoId}
              id={id}
              idBeingMerged={idBeingMerged}
            />
          );
        })}
      </InnerWrap>

      {gameOver && (
        <GameOverOverlay>
          <h2>Game over</h2>
        </GameOverOverlay>
      )}
    </Wrap>
  );
};

export default Grid;

const Wrap = styled.div`
  position: relative;
  background-color: ${({ theme }) => theme.grid_background};
  border-radius: ${generalStyles.border_radius};
  overflow: hidden;
`;

const InnerWrap = styled.div`
  position: relative;
  display: flex;
  margin: ${generalStyles.spacing_8};
`;

const GameOverOverlay = styled.div`
  position: absolute;
  inset: 0;
  backdrop-filter: blur(3px);
  background-color: ${({ game_over_background }) => game_over_background};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  h2 {
    user-select: none;
  }
`;
