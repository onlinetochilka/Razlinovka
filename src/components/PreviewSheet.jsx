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

        {/* ????? ????? */}
        {paths.map((p, i) => {
          let dash = p.dasharray;
          let cap = p.linecap ?? 'square';
          if (!dash) {
            if (lineStyle === 'dashed') dash = '4 4';
            else if (lineStyle === 'dotted') {
              dash = '1 3';
              cap = 'round';
            }
          }
          return (
            <path
              key={i}
              d={p.d}
              fill="none"
              stroke={lineColor}
              strokeWidth={p.strokeWidth ?? lineThick}
              opacity={p.opacity ?? 1}
              strokeDasharray={dash}
              strokeLinecap={cap}
              clipPath="url(#gridClip)"
            />
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
