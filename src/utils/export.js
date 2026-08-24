/**
 * Экспорт PDF и PNG.
 * PDF: jsPDF + svg2pdf.js
 * PNG: canvas + прозрачный фон, fallback при OOM
 */

import { PX_PER_MM } from './constants';

/* ── Утилиты ────────────────────────────────────────────────────────────── */

const PAPER_NAMES = {
  '210x297': 'A4',
  '297x420': 'A3',
  '148.5x210': 'A5',
};

function getPaperName(state) {
  const key = `${state.paperW}x${state.paperH}`;
  return PAPER_NAMES[key] ?? `${state.paperW}x${state.paperH}`;
}

function buildFilename(ext, state) {
  return `tochilka-${getPaperName(state)}-${state.gridType}.${ext}`;
}

function getSheetDimensions(state) {
  const { paperW: W, paperH: H, orientation } = state;
  return orientation === 'landscape' ? { w: H, h: W } : { w: W, h: H };
}

/* ── PDF ────────────────────────────────────────────────────────────────── */

export async function exportPDF(svgElement, state) {
  const { jsPDF } = await import('jspdf');
  const { svg2pdf } = await import('svg2pdf.js');

  const { w, h } = getSheetDimensions(state);

  const doc = new jsPDF({
    orientation: w > h ? 'l' : 'p',
    unit:        'mm',
    format:      [w, h],
  });

  await svg2pdf(svgElement, doc, { x: 0, y: 0, width: w, height: h });
  doc.save(buildFilename('pdf', state));
}

/* ── PNG ────────────────────────────────────────────────────────────────── */

export function exportPNG(svgElement, state, attemptScale = 3) {
  return new Promise((resolve) => {
    const { w, h } = getSheetDimensions(state);

    let SCALE = attemptScale;
    const basePxW = w * PX_PER_MM;
    const basePxH = h * PX_PER_MM;
    const MAX_AREA = 16_000_000;

    // Автоматически снижаем начальный SCALE, если площадь слишком велика
    if (attemptScale === 3) {
      while (SCALE > 1 && basePxW * SCALE * basePxH * SCALE > MAX_AREA) {
        SCALE -= 0.5;
      }
    }

    const pxW = Math.round(basePxW * SCALE);
    const pxH = Math.round(basePxH * SCALE);

    // Клонируем SVG, задаём пиксельные размеры; убираем белый фон
    const svgClone = svgElement.cloneNode(true);
    svgClone.setAttribute('width',  pxW);
    svgClone.setAttribute('height', pxH);
    const bgClone = svgClone.querySelector('#bgRect');
    if (bgClone) bgClone.setAttribute('fill', 'none');

    const svgData = new XMLSerializer().serializeToString(svgClone);
    const blob    = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url     = URL.createObjectURL(blob);

    const img = new Image();
    img.onload = () => {
      try {
        const canvas  = document.createElement('canvas');
        canvas.width  = pxW;
        canvas.height = pxH;
        // Намеренно не вызываем fillRect — фон остаётся прозрачным
        canvas.getContext('2d').drawImage(img, 0, 0);

        const dataUrl = canvas.toDataURL('image/png');

        // Проверка на случай, если toDataURL вернул пустую строку (ошибка памяти)
        if (dataUrl === 'data:,') {
          throw new Error('Canvas toDataURL returned empty data');
        }

        URL.revokeObjectURL(url);

        const link    = document.createElement('a');
        link.download = buildFilename('png', state);
        link.href     = dataUrl;
        link.click();

        resolve();
      } catch (err) {
        URL.revokeObjectURL(url);
        // Если произошла ошибка (краш по памяти) — пробуем уменьшить масштаб
        if (SCALE > 1) {
          console.warn(`exportPNG failed at scale ${SCALE}, retrying with ${SCALE - 0.5}`);
          exportPNG(svgElement, state, SCALE - 0.5).then(resolve);
        } else {
          console.error('exportPNG completely failed:', err);
          resolve();
        }
      }
    };
    img.onerror = () => { URL.revokeObjectURL(url); resolve(); };
    img.src = url;
  });
}
