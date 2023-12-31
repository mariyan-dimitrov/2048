import { useCallback, useEffect, useRef, useState } from 'react';
import { setStoreMe } from 'store-me';
import styled from 'styled-components';
import cn from 'classnames';

const Tile = ({ x, y, value, goingToMergeIntoId, id, idBeingMerged }) => {
  const [pulsate, setPulsate] = useState(false);
  const isInitialRender = useRef(true);

  const handleMerge = useCallback(
    () =>
      setStoreMe(({ tiles, numberOfTilesMerged }) => {
        const newTiles = tiles.map(tile => ({ ...tile })).filter(tile => tile.id !== id);

        for (let index = 0; index < newTiles.length; index++) {
          const tile = newTiles[index];

          if (tile.id === goingToMergeIntoId) {
            tile.value = tile.value * 2;
            tile.idBeingMerged = false;
          }
        }

        return { tiles: newTiles, numberOfTilesMerged: numberOfTilesMerged + 1 };
      }),
    [goingToMergeIntoId, id]
  );

  const handleTileMovement = useCallback(
    () => setStoreMe(({ numberOfTilesMoved }) => ({ numberOfTilesMoved: numberOfTilesMoved + 1 })),
    []
  );

  useEffect(
    function indicateMerge() {
      if (isInitialRender.current) {
        isInitialRender.current = false;
      } else {
        setPulsate(true);
      }
    },
    [value]
  );

  return (
    <Wrap
      x={x}
      y={y}
      onTransitionEnd={e => {
        if (e.target === e.currentTarget) {
          handleTileMovement();
          goingToMergeIntoId && handleMerge();
        }
      }}
      className={cn({
        'is-dynamic': value,
        'tile-being-merged': idBeingMerged,
      })}
    >
      <InnerWrap
        onAnimationEnd={e => e.target === e.currentTarget && e.animationName === 'pulsate' && setPulsate(false)}
        value={value}
        className={cn({
          'is-dynamic': value,
          'should-pulsate': pulsate,
        })}
      >
        {value || `${x}-${y}`}
      </InnerWrap>
    </Wrap>
  );
};

export default Tile;

const Wrap = styled.div`
  width: 84px;
  height: 84px;
  border-radius: 4px;
  padding: 8px;
  background-color: ${({ theme }) => theme.grid_background};

  &.is-dynamic {
    transition: transform 0.1s ease-out;
    position: absolute;
    top: 0;
    left: 0;
    transform: translate(${({ x }) => x * 100}%, ${({ y }) => y * 100}%);

    &.tile-being-merged {
      z-index: 2;
    }
  }
`;

const InnerWrap = styled.div`
  padding: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.box_background};
  width: 100%;
  height: 100%;
  border-radius: 4px;

  &.is-dynamic {
    font-size: 32px;
    font-weight: 900;
    color: ${({ value, theme }) => theme[`box_color_${value}`]};
    background: ${({ value, theme }) => theme[`box_bg_${value}`]};
    animation: pulsate 0.1s ease-out;
  }

  &.should-pulsate {
    animation: pulsate 0.1s ease-out;
  }

  @keyframes pulsate {
    0% {
      transform: scale(1);
    }

    50% {
      transform: scale(1.15);
    }

    100% {
      transform: scale(1);
    }
  }
`;
