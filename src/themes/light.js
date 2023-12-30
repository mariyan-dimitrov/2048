export const general = {
  grid_background: '#bbada0',
  box_background: 'rgba(238,228,218,.35)',
  box_bg_2: '#eee4da',
  box_bg_4: '#ede0c8',
  box_bg_8: '#f2b179',
  box_bg_16: '#f59563',
  box_bg_32: '',
  box_bg_64: '',
  box_bg_128: '',
  box_color_2: '',
  box_color_4: '',
  box_color_8: '#fff',
  box_color_16: '#fff',
  box_color_32: '#fff',
};

const light = {
  themeName: 'light',
  translation: 'LIGHT',
  ...general,
};

Object.freeze(light);

export default light;
