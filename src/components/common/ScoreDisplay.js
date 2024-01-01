import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';

import usePrevious from '../../hooks/usePrevious';

const ScoreDisplay = ({ title, score }) => {
  const [scoresToBeAdded, setScoresToBeAdded] = useState({});
  const [previousScore, , hasScoreChanged] = usePrevious(score);
  const deltaScore = hasScoreChanged ? score - previousScore : 0;

  useEffect(() => {
    if (deltaScore) {
      setScoresToBeAdded(prevScores => {
        return {
          ...prevScores,
          [uuidv4()]: deltaScore,
        };
      });
    }
  }, [deltaScore]);

  return (
    <Wrap>
      <Title>{title}</Title>
      <Score>{score}</Score>

      {Object.keys(scoresToBeAdded).length > 0 &&
        Object.keys(scoresToBeAdded).map(scoreToAddId => {
          const scoreToAdd = scoresToBeAdded[scoreToAddId];

          return (
            <ScoreToAddWrap
              key={scoreToAddId}
              onAnimationEnd={e => {
                if (e.target === e.currentTarget && e.animationName === 'fade-down') {
                  setScoresToBeAdded(prevScores => ({ ...prevScores, [scoreToAddId]: 0 }));
                }
              }}
            >{`+ ${scoreToAdd}`}</ScoreToAddWrap>
          );
        })}
    </Wrap>
  );
};

export default ScoreDisplay;

const Wrap = styled.div`
  position: relative;
  display: flex;
  border-radius: 4px;
  background-color: #ffb756;
  color: #fff;
  padding: 8px 16px;
  user-select: none;
`;

const Title = styled.div`
  font-size: 16px;
  margin-right: 4px;
`;

const Score = styled.div`
  font-size: 16px;
`;

const ScoreToAddWrap = styled.div`
  position: absolute;
  font-weight: 900;
  right: 0;
  top: 0;
  color: #000;
  transform: translate(0, -200%);
  animation: fade-down 0.4s ease-out forwards;

  @keyframes fade-down {
    from {
      transform: translate(0, -200%);
      opacity: 1;
    }

    to {
      opacity: 0;
      transform: translate(0, -75%);
    }
  }
`;
