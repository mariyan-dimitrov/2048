import PropTypes from 'prop-types';

const hexToRgb_PropTypes = {
  hex: PropTypes.string.isRequired,
  opacity: PropTypes.number,
  returnAsArray: PropTypes.bool,
};

export const hex_to_rgb = props => {
  let { hex, opacity = 1, returnAsArray = false } = props;

  PropTypes.checkPropTypes(hexToRgb_PropTypes, props, 'prop', 'hex_to_rgb');

  if (hex.charAt(0) === '#') {
    hex = hex.substr(1);
  }

  if (hex.length < 2) {
    return hex;
  }

  if (hex.length > 6) {
    hex = hex.substr(0, 6);
  }

  const values = hex.split('');
  let r = null;
  let g = null;
  let b = null;

  if (hex.length === 2) {
    r = parseInt(values[0].toString() + values[1].toString(), 16);
    g = r;
    b = r;
  } else if (hex.length === 3) {
    r = parseInt(values[0].toString() + values[0].toString(), 16);
    g = parseInt(values[1].toString() + values[1].toString(), 16);
    b = parseInt(values[2].toString() + values[2].toString(), 16);
  } else if (hex.length === 6) {
    r = parseInt(values[0].toString() + values[1].toString(), 16);
    g = parseInt(values[2].toString() + values[3].toString(), 16);
    b = parseInt(values[4].toString() + values[5].toString(), 16);
  } else {
    return false;
  }

  if (returnAsArray) {
    return [r, g, b, opacity || 1];
  } else {
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }
};

const hexToHSLA_PropTypes = {
  hex: PropTypes.string.isRequired,
  brightness: PropTypes.number,
};

export const hex_to_hsl = props => {
  const { hex, brightness } = props;

  PropTypes.checkPropTypes(hexToHSLA_PropTypes, props, 'prop', 'hex_to_hsl');

  // Convert hex to RGB
  let r = 0;
  let g = 0;
  let b = 0;

  if (hex.length === 4) {
    r = '0x' + hex[1] + hex[1];
    g = '0x' + hex[2] + hex[2];
    b = '0x' + hex[3] + hex[3];
  } else if (hex.length === 7) {
    r = '0x' + hex[1] + hex[2];
    g = '0x' + hex[3] + hex[4];
    b = '0x' + hex[5] + hex[6];
  }

  // Convert to HSL
  r = r / 255;
  g = g / 255;
  b = b / 255;

  let colorMin = Math.min(r, g, b);
  let colorMax = Math.max(r, g, b);
  let delta = colorMax - colorMin;
  let h = 0;
  let s = 0;
  let l = 0;

  if (delta === 0) {
    h = 0;
  } else if (colorMax === r) {
    h = ((g - b) / delta) % 6;
  } else if (colorMax === g) {
    // prettier-ignore
    h = ((b - r) / delta) + 2;
  } else {
    // prettier-ignore
    h = ((r - g) / delta) + 4;
  }

  h = Math.round(h * 60);

  if (h < 0) {
    h += 360;
  }

  l = (colorMax + colorMin) / 2;
  // prettier-ignore
  s = delta === 0 ? 0 : delta / (1 - Math.abs((2 * l) - 1));
  s = Number((s * 100).toFixed(1));
  l = Number((l * 100).toFixed(1));

  if (brightness) {
    l = l + brightness;

    if (l > 100) {
      l = 100;
    }
  }

  return `hsl(${h}, ${Number(s.toFixed(2))}%, ${Number(l.toFixed(2))}%)`;
};

export const hsl_to_hex = props => {
  let { hsl } = props;
  let sep = hsl.indexOf(',') > -1 ? ',' : ' ';

  hsl = hsl.substr(4).split(')')[0].split(sep);

  let h = Number(hsl[0]);
  let s = parseFloat(hsl[1].substr(0, hsl[1].length - 1));
  let l = parseFloat(hsl[2].substr(0, hsl[2].length - 1));

  s /= 100;
  l /= 100;

  // prettier-ignore
  let c = (1 - Math.abs((2 * l) - 1)) * s;
  let x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  // prettier-ignore
  let m = l - (c / 2);
  let r = 0;
  let g = 0;
  let b = 0;

  if (0 <= h && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (60 <= h && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (120 <= h && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (180 <= h && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (240 <= h && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else if (300 <= h && h < 360) {
    r = c;
    g = 0;
    b = x;
  }

  // Having obtained RGB, convert channels to hex
  r = Math.round((r + m) * 255).toString(16);
  g = Math.round((g + m) * 255).toString(16);
  b = Math.round((b + m) * 255).toString(16);

  // Prepend 0s, if necessary
  if (r.length === 1) {
    r = '0' + r;
  }

  if (g.length === 1) {
    g = '0' + g;
  }

  if (b.length === 1) {
    b = '0' + b;
  }

  return `#${r}${g}${b}`.toUpperCase();
};

const hexWithBrightness_PropTypes = {
  hex: PropTypes.string.isRequired,
  brightness: PropTypes.number.isRequired,
};

export const hex_with_brightness = props => {
  const { hex, brightness } = props;

  PropTypes.checkPropTypes(hexWithBrightness_PropTypes, props, 'prop', 'hex_with_brightness');

  return hsl_to_hex({ hsl: hex_to_hsl({ hex, brightness }) });
};
