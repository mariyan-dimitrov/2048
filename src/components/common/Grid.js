import styled from 'styled-components';
import { setStoreMe, useStoreMe } from 'store-me';

import CONFIG from '../../_constants/config';
import Button from './Button';
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

          <Button text="Start new game" onClick={() => setStoreMe({ shouldStartNewGame: true })} />
        </GameOverOverlay>
      )}
    </Wrap>
  );
};

export default Grid;

const Wrap = styled.div`
  background-color: ${({ theme }) => theme.grid_background};
  border-radius: 4px;
  position: relative;
  overflow: hidden;
`;

const InnerWrap = styled.div`
  display: flex;
  position: relative;
  margin: 8px;
`;

const GameOverOverlay = styled.div`
  position: absolute;
  inset: 0;
  backdrop-filter: blur(3px);
  background-color: #ffffffba;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  h2 {
    user-select: none;
  }
`;
