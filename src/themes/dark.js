import { hex_with_brightness } from '../utils/js/convertColorType';

export const general = {
  surface_1: '#0E1014',
  surface_2: '#13161D',
  surface_3: '#1B1E27',
  border: '#222630',
  border_dark: hex_with_brightness({ hex: '#222630', brightness: -5 }),
  shadow_token: `rgb(14, 16, 20)`,
  shadow_general: `0px 6px 24px rgba(14, 16, 20, 0.6)`,
  shadow_accent: `0px 0px 16px #1E4DD8`,
  shadow_attention: `0px 0px 16px #e39929b8`,
  custom_scrollbar: 'rgba(107, 109, 128, 0.7)',
  native_scrollbar: 'rgba(76, 77, 94, 1)',
};

export const text = {
  text_primary: '#E6E8ED',
  text_secondary: '#ADB2C1',
  text_tertiary: '#818492',
};

export const accents = {
  accent_1: '#3262F0',
  accent_1_dark: hex_with_brightness({ hex: '#3262F0', brightness: -5 }),
  accent_1_darker: hex_with_brightness({ hex: '#3262F0', brightness: -10 }),
  accent_2: '#29324A',
  accent_2_dark: hex_with_brightness({ hex: '#29324A', brightness: -5 }),
  accent_2_darker: hex_with_brightness({ hex: '#29324A', brightness: -10 }),
  accent_3: '#26C971',
  accent_3_dark: hex_with_brightness({ hex: '#26C971', brightness: -5 }),
  accent_3_darker: hex_with_brightness({ hex: '#26C971', brightness: -10 }),
};

export const semantic = {
  semantic_success: '#00A76A',
  semantic_attention: '#E39929',
  semantic_error: '#CE422F',
};

export const gradients = {
  chart_gradient_1_primary: '#7517F8',
  chart_gradient_1_secondary: '#E323FF',
  chart_gradient_2_primary: '#02A4FF',
  chart_gradient_2_secondary: '#7D40FF',
  chart_gradient_3_primary: '#FC9700',
  chart_gradient_3_secondary: '#DBFF00',
};

const dark = {
  themeName: 'dark',
  translation: 'DARK',
  ...general,
  ...text,
  ...accents,
  ...semantic,
  ...gradients,
};

Object.freeze(general);
Object.freeze(text);
Object.freeze(accents);
Object.freeze(semantic);
Object.freeze(gradients);
Object.freeze(dark);

export default dark;
