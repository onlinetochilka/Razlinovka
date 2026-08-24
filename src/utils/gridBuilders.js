/**
 * Генераторы SVG path — алгоритмы точно по app.js (строки 379–516).
 * Все координаты в миллиметрах. Возвращают массив объектов:
 *   [{ d, opacity?, dasharray?, linecap? }]
 */

/** Округляет координату до 3 знаков (избегает float-мусора в path d) */
function r(n) { return Math.round(n * 1000) / 1000; }

/* ── Примитивы ─────────────────────────────────────────────────────────── */

export function hLines(x0, y0, x1, y1, step) {
  let d = '';
  const n = Math.floor((y1 - y0) / step);
  for (let i = 0; i <= n; i++) {
    const y = r(y0 + i * step);
    d += `M ${r(x0)} ${y} H ${r(x1)} `;
  }
  return d;
}

export function vLines(x0, y0, x1, y1, step) {
  let d = '';
  const n = Math.floor((x1 - x0) / step);
  for (let i = 0; i <= n; i++) {
    const x = r(x0 + i * step);
    d += `M ${x} ${r(y0)} V ${r(y1)} `;
  }
  return d;
}

/* ── Клетка ────────────────────────────────────────────────────────────── */

export function buildSquareGrid(x0, y0, x1, y1, step) {
  return [{ d: hLines(x0, y0, x1, y1, step) + vLines(x0, y0, x1, y1, step) }];
}

/* ── Миллиметровка (ГОСТ): 3 path с разной прозрачностью ───────────────── */

export function buildMillimeterGrid(x0, y0, x1, y1) {
  const grid = (s) => hLines(x0, y0, x1, y1, s) + vLines(x0, y0, x1, y1, s);
  return [
    { d: grid(1),  opacity: 0.35 },
    { d: grid(5),  opacity: 0.65 },
    { d: grid(10), opacity: 1.0  },
  ];
}

/* ── Линейка — только горизонтальные ──────────────────────────────────── */

export function buildRuledLines(x0, y0, x1, y1, step) {
  return [{ d: hLines(x0, y0, x1, y1, step) }];
}

/* ── Точечная сетка: dasharray-трюк ───────────────────────────────────── */

export function buildDotGrid(x0, y0, x1, y1, step) {
  return [{
    d:         hLines(x0, y0, x1, y1, step),
    dasharray: `0 ${step}`,
    linecap:   'round',
  }];
}

/* ── Изометрия (равносторонние треугольники) ───────────────────────────── */

export function buildIsometricGrid(x0, y0, x1, y1, step) {
  const tan60 = Math.tan(Math.PI / 3);
  const sin60 = Math.sin(Math.PI / 3);
  const vStep = step * sin60;
  const h     = y1 - y0;
  const w     = x1 - x0;
  const dxH   = h / tan60;

  let d = hLines(x0, y0, x1, y1, vStep);

  const nLeft = Math.ceil(dxH / step) + 1;
  for (let i = -nLeft; i <= Math.ceil(w / step) + 1; i++) {
    const tx = x0 + i * step;
    d += `M ${r(tx)} ${r(y0)} L ${r(tx + dxH)} ${r(y1)} `;
  }
  for (let i = 0; i <= Math.ceil((w + dxH) / step) + 1; i++) {
    const tx = x0 + i * step;
    d += `M ${r(tx)} ${r(y0)} L ${r(tx - dxH)} ${r(y1)} `;
  }

  return [{ d }];
}

/* ── Нотный стан: группы по 5 линий с шагом 2 мм, между станами 12 мм ─── */

export function buildNotesGrid(x0, y0, x1, y1) {
  const LINE_STEP = 2;              // мм между линиями стана
  const STAFF_H   = 4 * LINE_STEP;  // 8 мм — высота стана (4 промежутка)
  const BETWEEN   = 12;             // мм между станами
  const CYCLE     = STAFF_H + BETWEEN; // 20 мм

  let d = '';
  for (let staffTop = y0; staffTop < y1; staffTop += CYCLE) {
    for (let i = 0; i < 5; i++) {
      const y = r(staffTop + i * LINE_STEP);
      if (y > y1 + 0.001) break;
      d += `M ${r(x0)} ${y} H ${r(x1)} `;
    }
  }
  return [{ d }];
}

/* ── Косая / Частая косая (ГОСТ) ───────────────────────────────────────── */
// Горизонтальные рабочие строки: пары линий с шагом 4 мм, пропуск 8 мм
// Косые линии под углом 65° от горизонтали
// diagPitch: шаг диагоналей (25 мм для Косой, 5 мм для Частой)

export function buildSlantedGrid(x0, y0, x1, y1, diagPitch) {
  const ANGLE    = 65 * Math.PI / 180;
  const tanA     = Math.tan(ANGLE);   // ≈ 2.145
  const ROW_STEP = 4;                 // мм: шаг внутри пары
  const GAP      = 8;                 // мм: пропуск между парами
  const CYCLE    = ROW_STEP + GAP;    // 12 мм
  const h        = y1 - y0;

  let d = '';

  // Парные горизонтальные линии (ГОСТ)
  for (let pairY = y0; pairY < y1; pairY += CYCLE) {
    d += `M ${r(x0)} ${r(pairY)} H ${r(x1)} `;
    const y2 = r(pairY + ROW_STEP);
    if (y2 <= y1) d += `M ${r(x0)} ${y2} H ${r(x1)} `;
  }

  // Диагонали: от (bx, y1) к (bx + offsetX, y0) — снизу-слева вверх-вправо
  const offsetX = h / tanA;
  const startBx = x0 - (Math.ceil(offsetX / diagPitch) + 1) * diagPitch;
  const endBx   = x1 + diagPitch;

  for (let bx = startBx; bx <= endBx; bx += diagPitch) {
    d += `M ${r(bx)} ${r(y1)} L ${r(bx + offsetX)} ${r(y0)} `;
  }

  return [{ d }];
}

/* ── Маршрутизатор ─────────────────────────────────────────────────────── */

export function buildGridPaths(type, x0, y0, x1, y1, step) {
  switch (type) {
    case 'square':     return buildSquareGrid(x0, y0, x1, y1, step);
    case 'millimeter': return buildMillimeterGrid(x0, y0, x1, y1);
    case 'ruled':      return buildRuledLines(x0, y0, x1, y1, step);
    case 'dots':       return buildDotGrid(x0, y0, x1, y1, step);
    case 'isometric':  return buildIsometricGrid(x0, y0, x1, y1, step);
    case 'notes':      return buildNotesGrid(x0, y0, x1, y1);
    case 'slanted':    return buildSlantedGrid(x0, y0, x1, y1, 25);
    case 'frequent':   return buildSlantedGrid(x0, y0, x1, y1, 5);
    default:           return buildSquareGrid(x0, y0, x1, y1, step);
  }
}

/* ── Вычисление границ сетки со snap-to-grid ───────────────────────────── */
// Адаптировано из renderPreview (строки 541–566 app.js)

export function computeGridBounds(state) {
  const { margins, gridType, gridStep } = state;
  const { w, h } = getSheetDimensions(state);
  const { top: mT, bottom: mB, left: mL, right: mR } = margins;

  const x0 = mL;
  const y0 = mT;

  // Привязываем правый/нижний край к целому числу шагов (нет обрезков)
  const stepY =
    gridType === 'millimeter'                                    ? 10 :
    gridType === 'notes'                                         ? 20 :
    (gridType === 'slanted' || gridType === 'frequent')          ? 12 :
    gridStep;
  const stepX =
    (gridType === 'square' || gridType === 'dots' || gridType === 'isometric') ? gridStep :
    gridType === 'millimeter'                                                   ? 10 :
    1;

  const x1 = x0 + Math.floor((w - mL - mR) / stepX) * stepX;
  const y1 = y0 + Math.floor((h - mT - mB) / stepY) * stepY;

  return { x0, y0, x1, y1 };
}

/* ── Координата красной (школьной) линии ───────────────────────────────── */
// Адаптировано из renderPreview (строки 637–644 app.js)

export function computeSchoolMargin(gridType, gridStep, x0, x1) {
  // Клетка — ровно 4 шага от снаппованного x1
  // ruled / slanted / frequent — фиксированный отступ 25 мм
  const redOffset = gridType === 'square' ? 4 * gridStep : 25;
  return x1 - redOffset > x0 ? r(x1 - redOffset) : null;
}

/* ── Вспомогательная: размеры листа с учётом ориентации ────────────────── */

export function getSheetDimensions(state) {
  const { paperW: W, paperH: H, orientation } = state;
  return orientation === 'landscape' ? { w: H, h: W } : { w: W, h: H };
}
