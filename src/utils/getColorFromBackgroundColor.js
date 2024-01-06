import { fontColors } from '../themes/light';
import hexToRgb from './hexToRgb';

const getColorFromBackgroundColor = hexColor => {
  const { red, green, blue } = hexToRgb(hexColor.padStart(6, '0'));

  return red * 0.299 + green * 0.587 + blue * 0.114 > 186 ? fontColors.text_secondary_color : fontColors.text_color;
};

export default getColorFromBackgroundColor;
