import styled from 'styled-components';
import Tile from './Tile';
import { useStoreMe } from 'store-me';

const size = 4;

const Grid = () => {
  const { tiles } = useStoreMe('tiles');

  return (
    <Wrap>
      <InnerWrap>
        {[...Array(size)].map((_, x) => {
          return (
            <div key={x}>
              {[...Array(size)].map((_, y) => (
                <Tile x={x} y={y} key={`${x}-${y}`} />
              ))}
            </div>
          );
        })}

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
