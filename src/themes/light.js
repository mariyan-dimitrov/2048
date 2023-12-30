import { hex_with_brightness } from '../utils/js/convertColorType';

export const general = {
  surface_1: '#F6F8FB',
  surface_2: '#FFFFFF',
  surface_3: '#F5F7FC',
  border: '#E6E9EC',
  border_dark: hex_with_brightness({ hex: '#E6E9EC', brightness: -5 }),
  shadow_token: `rgb(9, 26, 61)`,
  shadow_general: `0px 6px 16px rgba(9, 26, 61, 0.1)`,
  shadow_accent: `0px 0px 20px rgba(50, 98, 240, 0.6)`,
  custom_scrollbar: 'rgba(201, 201, 203, 0.7)',
  native_scrollbar: 'rgba(185, 185, 185, 1)',
};

export const text = {
  text_primary: '#121C38',
  text_secondary: '#4E4F54',
  text_tertiary: '#818492',
};

export const accents = {
  accent_1: '#3262F0',
  accent_1_dark: hex_with_brightness({ hex: '#3262F0', brightness: -5 }),
  accent_1_darker: hex_with_brightness({ hex: '#3262F0', brightness: -10 }),
  accent_2: '#DEE6FB',
  accent_2_dark: hex_with_brightness({ hex: '#DEE6FB', brightness: -5 }),
  accent_2_darker: hex_with_brightness({ hex: '#DEE6FB', brightness: -10 }),
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

const light = {
  themeName: 'light',
  translation: 'LIGHT',
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
Object.freeze(light);

export default light;
