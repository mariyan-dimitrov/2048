const styles = {
  grid: {
    gutter: {
      mobile: 16,
      tablet: 16,
      desktop: 24,
    },
    colWidth: 68,
    breakpoints: {
      mobile: '(max-width: 580px)',
      tablet: '(min-width: 581px) and (max-width: 1127px)',
      desktop: '(min-width: 1128px)',
    },
  },
  menu_breakpoints: {
    mobile: '(max-width: 780px)',
    tablet: '(min-width: 781px) and (max-width: 1396px)',
    desktop: '(min-width: 1397px)',
  },
  borderRadius: {
    radius_1: 6,
    radius_2: 4,
    radius_3: 2,
  },
  spacing: {
    _2: 2,
    _4: 4,
    _8: 8,
    _12: 12,
    _16: 16,
    _24: 24,
    _32: 32,
    _40: 40,
    _48: 48,
    _64: 64,
    _80: 80,
    _96: 96,
  },
  typography: {
    weights: [400, 500, 700],
    marketing: {
      1: {
        font_size: 56,
        line_height: '70px',
      },
      2: {
        font_size: 48,
        line_height: '60px' /* 125% */,
      },
      3: {
        font_size: 42,
        line_height: '53px' /* 125% */,
      },
    },
    headings: {
      1: {
        font_size: 28,
        line_height: '35px' /* 125% */,
      },
      2: {
        font_size: 22,
        line_height: '28px' /* 125% */,
      },
      3: {
        font_size: 18,
        line_height: '23px' /* 125% */,
      },
      4: {
        font_size: 16,
        line_height: '20px' /* 125% */,
      },
      5: {
        font_size: 14,
        line_height: '18px' /* 125% */,
      },
      6: {
        font_size: 12,
        line_height: '15px' /* 125% */,
      },
    },
    body: {
      1: {
        font_size: 14,
        line_height: '19px' /* 135% */,
      },
      2: {
        font_size: 16,
        line_height: '22px' /* 135% */,
      },
    },
  },
};

Object.freeze(styles);

export default styles;
