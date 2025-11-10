const FALLBACK_COLOR = '#cccccc';

const normalizeHex = (hex) => {
  if (typeof hex !== 'string') return null;
  const trimmed = hex.trim();
  if (!trimmed) return null;
  let value = trimmed.replace('#', '');
  if (value.length === 3) {
    value = value.split('').map((char) => char + char).join('');
  }
  if (value.length !== 6 || /[^0-9a-f]/i.test(value)) {
    return null;
  }
  return `#${value.toLowerCase()}`;
};

export const shiftHex = (hex, ratio) => {
  const normalized = normalizeHex(hex) || FALLBACK_COLOR;
  const numeric = parseInt(normalized.replace('#', ''), 16);
  const r = (numeric >> 16) & 0xff;
  const g = (numeric >> 8) & 0xff;
  const b = numeric & 0xff;

  const clamp = (value) => Math.min(255, Math.max(0, Math.round(value)));
  const adjustChannel = (channel) => {
    if (ratio >= 0) {
      return clamp(channel + (255 - channel) * Math.min(1, ratio));
    }
    return clamp(channel + channel * Math.max(-1, ratio));
  };

  const toHex = (value) => value.toString(16).padStart(2, '0');
  return `#${toHex(adjustChannel(r))}${toHex(adjustChannel(g))}${toHex(adjustChannel(b))}`;
};

export const hexToRgba = (hex, alpha = 1) => {
  const normalized = normalizeHex(hex) || FALLBACK_COLOR;
  const numeric = parseInt(normalized.replace('#', ''), 16);
  const r = (numeric >> 16) & 0xff;
  const g = (numeric >> 8) & 0xff;
  const b = numeric & 0xff;
  const safeAlpha = Math.min(1, Math.max(0, alpha));
  return `rgba(${r}, ${g}, ${b}, ${safeAlpha})`;
};

export const ensureColor = (color) =>
  (typeof color === 'string' && color.trim() ? color : FALLBACK_COLOR);

const buildPreset = (label, builder) => ({
  label,
  getStyle: (props) => {
    const base = ensureColor(props.backgroundColor);
    const { wrapper = {}, surface = {}, fillColor } = builder(base, props) || {};
    const resolvedSurface = { backgroundColor: base, ...surface };

    return {
      wrapper,
      surface: resolvedSurface,
      fillColor: fillColor || resolvedSurface.backgroundColor || base,
    };
  },
});

export const SHAPE_STYLE_PRESETS = {
  default: buildPreset('Default', (base) => ({
    surface: { backgroundColor: base },
  })),
  modern: buildPreset('Modern', (base) => {
    const highlight = shiftHex(base, 0.25);
    return {
      wrapper: {
        borderRadius: '18px',
        boxShadow: `0 18px 35px ${hexToRgba(base, 0.35)}`,
      },
      surface: {
        borderRadius: '18px',
        backgroundColor: base,
        backgroundImage: `linear-gradient(135deg, ${base}, ${highlight})`,
      },
    };
  }),
  soft: buildPreset('Soft Shadow', (base) => {
    const light = shiftHex(base, 0.3);
    const dark = shiftHex(base, -0.2);
    return {
      wrapper: {
        borderRadius: '28px',
        boxShadow: `14px 14px 28px ${hexToRgba(dark, 0.4)}, -14px -14px 28px ${hexToRgba(light, 0.65)}`,
      },
      surface: {
        borderRadius: '28px',
        backgroundColor: base,
      },
    };
  }),
  outline: buildPreset('Outline', (base) => {
    const accent = shiftHex(base, -0.35);
    const fill = shiftHex(base, 0.4);
    return {
      wrapper: {
        borderRadius: '8px',
        boxShadow: `0 0 0 3px ${hexToRgba(accent, 0.85)}, 0 12px 24px rgba(15, 23, 42, 0.15)`,
      },
      surface: {
        borderRadius: '8px',
        backgroundColor: fill,
      },
      fillColor: fill,
    };
  }),
  glass: buildPreset('Glass', (base) => ({
    wrapper: {
      borderRadius: '20px',
      boxShadow: '0 25px 50px rgba(15, 23, 42, 0.35)',
    },
    surface: {
      borderRadius: '20px',
      backgroundColor: hexToRgba(base, 0.35),
      backdropFilter: 'blur(16px)',
      border: `1px solid ${hexToRgba(base, 0.5)}`,
    },
  })),
};

export const SHAPE_STYLE_OPTIONS = Object.entries(SHAPE_STYLE_PRESETS).map(([value, preset]) => ({
  value,
  label: preset.label || value,
}));

export const getShapeVariantStyles = (styleKey = 'default', props = {}) => {
  const preset = SHAPE_STYLE_PRESETS[styleKey] || SHAPE_STYLE_PRESETS.default;
  if (!preset) {
    return {
      wrapper: {},
      surface: { backgroundColor: ensureColor(props.backgroundColor) },
    };
  }

  const presetStyles = preset.getStyle(props) || {};
  const wrapper = presetStyles.wrapper || {};
  const baseColor = ensureColor(props.backgroundColor);
  const surface = { backgroundColor: baseColor, ...(presetStyles.surface || {}) };

  return {
    wrapper,
    surface,
    fillColor: presetStyles.fillColor || surface.backgroundColor || baseColor,
  };
};

