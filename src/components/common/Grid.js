import styled from 'styled-components';
import { useStoreMe } from 'store-me';

import CONFIG from '../../_constants/config';
import Tile from './Tile';

const Grid = () => {
  const { tiles } = useStoreMe('tiles');

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
    </Wrap>
  );
};

export default Grid;

const Wrap = styled.div`
  background-color: ${({ theme }) => theme.grid_background};
  border-radius: 4px;
`;

const InnerWrap = styled.div`
  display: flex;
  position: relative;
  margin: 8px;
`;
