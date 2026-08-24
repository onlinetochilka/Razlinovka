/** Константы проекта Разлиновка */

export const PAPER_SIZES = {
  A4: { w: 210,   h: 297 },
  A5: { w: 148.5, h: 210 },
  A3: { w: 297,   h: 420 },
};

export const GRID_TYPES = [
  { id: 'square',     label: 'Клетка' },
  { id: 'ruled',      label: 'Линейка' },
  { id: 'slanted',    label: 'Косая' },
  { id: 'frequent',   label: 'Частая косая' },
  { id: 'millimeter', label: 'Мм-бумага' },
  { id: 'notes',      label: 'Ноты' },
  { id: 'isometric',  label: 'Изометрия' },
  { id: 'dots',       label: 'Точки' },
];

/** Типы сетки с фиксированным шагом (нельзя менять через UI) */
export const FIXED_STEP_TYPES = ['millimeter', 'slanted', 'frequent', 'notes'];

/** Типы сетки, для которых доступен тумблер «Школьные поля» */
export const SCHOOL_MARGIN_TYPES = ['square', 'ruled', 'slanted', 'frequent'];

/** Шаги по умолчанию при переключении типа сетки */
export const STEP_DEFAULTS = { square: 5, ruled: 8, dots: 5, isometric: 6 };

export const COLOR_PRESETS = [
  { hex: '#000000', label: 'Чёрный' },
  { hex: '#94a3b8', label: 'Серый' },
  { hex: '#006584', label: 'Синий' },
  { hex: '#B71234', label: 'Красный' },
  { hex: '#10b981', label: 'Зелёный' },
];

/** Минимальная рабочая область (мм) при любых полях */
export const MIN_GRID_AREA = 20;

/** 96 dpi → мм */
export const PX_PER_MM = 3.7795275591;

export const METRIKA_ID = 109837787;
