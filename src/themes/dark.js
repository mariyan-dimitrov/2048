import getColorFromBackgroundColor from '../utils/getColorFromBackgroundColor';

export const fontColors = {
  text_color: '#fff',
  text_secondary_color: '#000',
};

const duplicatedColors = {};

function getRandomColor() {
  const red = Math.floor(Math.random() * 100);
  const green = Math.floor(Math.random() * 100);
  const blue = Math.floor(Math.random() * 100);

  const hexRed = red.toString(16).padStart(2, '0');
  const hexGreen = green.toString(16).padStart(2, '0');
  const hexBlue = blue.toString(16).padStart(2, '0');

  return `${hexRed}${hexGreen}${hexBlue}`;
}

const tileColors = {};

for (let tileValue = 2; tileValue <= Number.MAX_SAFE_INTEGER; tileValue *= 2) {
  let hexColor;

  do {
    hexColor = getRandomColor();
    tileColors[`tile_bg_${tileValue}`] = `#${hexColor}`;
  } while (duplicatedColors[hexColor]);

  duplicatedColors[hexColor] = true;
  tileColors[`tile_color_${tileValue}`] = getColorFromBackgroundColor(hexColor);
}

export const general = {
  btn_button: '#ffb756',
  btn_hover_button: '$#f59b21',
  grid_background: '#bbada0',
  game_over_background: '#ffffffba',
  box_background: 'rgba(238,228,218,.35)',
  ...fontColors,
  ...tileColors,
};

const dark = {
  themeName: 'dark',
  translation: 'DARK',
  ...general,
};

Object.freeze(dark);

export default dark;
