/**
 * Zustand-стор с persist (localStorage).
 * Вся бизнес-логика состояния разлиновки.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  PAPER_SIZES,
  FIXED_STEP_TYPES,
  SCHOOL_MARGIN_TYPES,
  STEP_DEFAULTS,
  MIN_GRID_AREA,
} from '../utils/constants';

/* ── Утилиты ────────────────────────────────────────────────────────────── */

function clamp(val, mn, mx) { return Math.min(mx, Math.max(mn, val)); }

/** Snap к ближайшему кратному step */
function snap(val, step) { return Math.round(val / step) * step; }

/* ── Начальное состояние ────────────────────────────────────────────────── */

const DEFAULT_MARGINS = { top: 15, bottom: 15, left: 20, right: 10 };

const initialState = {
  paperSize:    'A4',
  paperW:       210,
  paperH:       297,
  orientation:  'portrait',
  gridType:     'square',
  gridStep:     5,
  lineThick:    0.3,
  lineColor:    '#94a3b8',
  margins:      { ...DEFAULT_MARGINS },
  schoolMargins: true,

  // Внутреннее: сохранённые поля до «обнуления» (null = режим не активен)
  _savedMargins: null,
};

/* ── Стор ───────────────────────────────────────────────────────────────── */

export const useRulingStore = create(
  persist(
    (set, get) => ({
      ...initialState,

      /* ─── Размер бумаги ──────────────────────────────────────────────── */
      setPaperSize(size) {
        const p = PAPER_SIZES[size];
        if (!p) return;
        set({ paperSize: size, paperW: p.w, paperH: p.h });
      },

      /* ─── Ориентация ─────────────────────────────────────────────────── */
      setOrientation(orient) {
        set({ orientation: orient });
      },

      /* ─── Тип сетки ──────────────────────────────────────────────────── */
      setGridType(type) {
        const isFixed = FIXED_STEP_TYPES.includes(type);
        const nextStep = isFixed ? get().gridStep : (STEP_DEFAULTS[type] ?? get().gridStep);
        set({
          gridType: type,
          gridStep: isFixed ? get().gridStep : nextStep,
          // Сбрасываем тумблер школьных полей если тип его не поддерживает
          schoolMargins: SCHOOL_MARGIN_TYPES.includes(type) ? get().schoolMargins : false,
        });
      },

      /* ─── Шаг сетки ──────────────────────────────────────────────────── */
      setGridStep(step) {
        const clamped = clamp(step, 2, 20);
        const snapped = snap(clamped, 0.5);
        set({ gridStep: snapped });
      },

      /* ─── Толщина линии ──────────────────────────────────────────────── */
      setLineThick(thick) {
        const clamped = clamp(thick, 0.1, 1.0);
        const snapped = snap(clamped, 0.05);
        set({ lineThick: snapped });
      },

      /* ─── Цвет линии ─────────────────────────────────────────────────── */
      setLineColor(hex) {
        set({ lineColor: hex });
      },

      /* ─── Поля ───────────────────────────────────────────────────────── */
      setMargin(key, value) {
        const max = get().getMarginMax(key);
        const clamped = clamp(value, 0, max);
        set((s) => ({ margins: { ...s.margins, [key]: clamped } }));
      },

      /** Toggle: 0/0/0/0 ↔ сохранённые значения */
      resetMargins() {
        const { _savedMargins, margins } = get();
        if (_savedMargins) {
          // Деактивируем — восстанавливаем
          set({ margins: { ..._savedMargins }, _savedMargins: null });
        } else {
          // Активируем — сохраняем и обнуляем
          set({
            _savedMargins: { ...margins },
            margins: { top: 0, bottom: 0, left: 0, right: 0 },
          });
        }
      },

      /* ─── Школьные поля ──────────────────────────────────────────────── */
      setSchoolMargins(bool) {
        set({ schoolMargins: bool });
      },

      /* ─── Computed: размеры листа с учётом ориентации ────────────────── */
      getSheetDimensions() {
        const { paperW: W, paperH: H, orientation } = get();
        return orientation === 'landscape' ? { w: H, h: W } : { w: W, h: H };
      },

      /* ─── Computed: максимально допустимое поле ──────────────────────── */
      getMarginMax(key) {
        const { w, h } = get().getSheetDimensions();
        const { top, bottom, left, right } = get().margins;
        switch (key) {
          case 'top':    return Math.max(0, h - bottom - MIN_GRID_AREA);
          case 'bottom': return Math.max(0, h - top    - MIN_GRID_AREA);
          case 'left':   return Math.max(0, w - right  - MIN_GRID_AREA);
          case 'right':  return Math.max(0, w - left   - MIN_GRID_AREA);
          default:       return 100;
        }
      },
    }),
    {
      name: 'razlinovka-state',
      // Не персистим внутреннее поле _savedMargins (сессионная логика)
      partialize: (s) => {
        // eslint-disable-next-line no-unused-vars
        const { _savedMargins, ...rest } = s;
        return rest;
      },
    },
  ),
);
