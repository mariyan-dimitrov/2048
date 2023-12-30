import { v4 as uuidv4 } from 'uuid';
const min = 0;
const max = 3;

const generateRandomNumber = () => Math.floor(Math.random() * (max - min + 1) + min);

const generateRandomTile = () => {
  return {
    value: 2,
    x: generateRandomNumber(),
    y: generateRandomNumber(),
    id: uuidv4(),
  };
};

export default generateRandomTile;
