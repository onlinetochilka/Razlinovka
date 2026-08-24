import { useMemo } from 'react';
import { useRulingStore } from '../store/useRulingStore';
import {
  buildGridPaths,
  computeGridBounds,
  computeSchoolMargin,
  getSheetDimensions,
} from '../utils/gridBuilders';
import { SCHOOL_MARGIN_TYPES } from '../utils/constants';

export default function PreviewSheet({ svgRef }) {
  const state = useRulingStore();
  const {
    gridType,
    gridStep,
    lineThick,
    lineColor,
    lineStyle,
    showHeaders,
    schoolMargins,
    orientation,
    paperW,
    paperH,
    margins,
  } = state;

  const { w, h } = useMemo(
    () => getSheetDimensions({ paperW, paperH, orientation }),
    [paperW, paperH, orientation],
  );

  const bounds = useMemo(
    () => computeGridBounds({ margins, gridType, gridStep, paperW, paperH, orientation }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [margins.top, margins.bottom, margins.left, margins.right, gridType, gridStep, paperW, paperH, orientation],
  );

  let { x0, y0, x1, y1 } = bounds;
  if (showHeaders) {
    y0 = Math.min(y0 + 15, y1);
  }

  const paths = useMemo(
    () => buildGridPaths(gridType, x0, y0, x1, y1, gridStep),
    [gridType, x0, y0, x1, y1, gridStep],
  );

  const needSchoolMargin = schoolMargins && SCHOOL_MARGIN_TYPES.includes(gridType);
  const marginX = useMemo(
    () => needSchoolMargin ? computeSchoolMargin(gridType, gridStep, x0, x1) : null,
    [needSchoolMargin, gridType, gridStep, x0, x1],
  );

  return (
    <main className="flex-1 flex items-center justify-center p-4 print:p-0 min-h-0">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${w} ${h}`}
        className="max-h-full max-w-full shadow-lg print:shadow-none"
        style={{ aspectRatio: `${w} / ${h}` }}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* ????? ??? (exportPNG ??????? ??? ????? id="bgRect") */}
        <rect id="bgRect" width={w} height={h} fill="#ffffff" />

        {/* Clip path ???????????? ????? ??????? ???????? */}
        <defs>
          <clipPath id="gridClip">
            <rect x={x0} y={y0} width={x1 - x0} height={y1 - y0} />
          </clipPath>
        </defs>

        {/* Сетка линий */}
        {paths.map((p, i) => {
          let dash = p.dasharray;
          let cap = p.linecap ?? 'square';
          let dashOffset = 0;

          if (!dash) {
            if (lineStyle === 'dashed') {
              // Синхронизируем штрих с шагом сетки
              const n = Math.max(1, Math.round(gridStep / 6));
              const piece = gridStep / (n * 2);
              dash = `${piece} ${piece}`;
              dashOffset = piece / 2; // Центрируем штрих на перекрестиях (крестик)
            }
            else if (lineStyle === 'dotted') {
              // Синхронизируем точки с шагом сетки
              const n = Math.max(2, Math.round(gridStep / 3));
              const piece = gridStep / n;
              dash = `0 ${piece}`;
              cap = 'round';
              dashOffset = 0; // Точка попадает ровно в перекрестие
            }
          }
          
          // Разбиваем путь на отдельные линии (M ...), чтобы dasharray 
          // начинался заново для каждой линии, иначе возникает смещение
          const segments = p.d.split(/(?=M )/).filter(Boolean);

          return (
            <g key={i}>
              {segments.map((seg, j) => (
                <path
                  key={j}
                  d={seg}
                  fill="none"
                  stroke={lineColor}
                  strokeWidth={p.strokeWidth ?? lineThick}
                  opacity={p.opacity ?? 1}
                  strokeDasharray={dash}
                  strokeDashoffset={dashOffset}
                  strokeLinecap={cap}
                  clipPath="url(#gridClip)"
                />
              ))}
            </g>
          );
        })}

        {showHeaders && (
          <text
            x={bounds.x0}
            y={10}
            fill={lineColor}
            fontSize="5"
            fontFamily="system-ui, sans-serif"
          >
            Ученик: _________________________________ Дата: ________________
          </text>
        )}

        {/* ??????? ???????? ????? */}
        {marginX !== null && (
          <line
            x1={marginX}
            y1={y0}
            x2={marginX}
            y2={y1}
            stroke="#B71234"
            strokeWidth={lineThick}
            clipPath="url(#gridClip)"
          />
        )}
      </svg>
    </main>
  );
}
