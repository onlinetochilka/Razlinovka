import { useState, useRef, useCallback } from 'react';
import { useRulingStore } from '../../store/useRulingStore';
import { FIXED_STEP_TYPES } from '../../utils/constants';

function NumInput({ value, min, max, step, disabled, onChange, label }) {
  const [local, setLocal] = useState(String(value));
  const [shake, setShake] = useState(false);
  const timer = useRef(null);

  // ?????????????? local ???? value ????????? ???????
  const prevVal = useRef(value);
  if (prevVal.current !== value) {
    prevVal.current = value;
    // ?? ????????? local ???? ???????????? ?????? ??????????? (blur ??? ?? ???)
  }

  const triggerShake = () => {
    setShake(false);
    requestAnimationFrame(() => requestAnimationFrame(() => setShake(true)));
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setShake(false), 400);
  };

  const commit = useCallback((raw) => {
    const n = parseFloat(raw);
    if (isNaN(n) || n < min || n > max) {
      triggerShake();
      setLocal(String(value));
      return;
    }
    onChange(n);
    setLocal(String(n));
  }, [min, max, value, onChange]);

  return (
    <label className="flex items-center gap-1.5 text-xs text-stone-600 select-none">
      {label}
      <input
        type="number"
        min={min}
        max={max}
        step={step}
        value={local}
        disabled={disabled}
        aria-label={label}
        className={`w-16 min-h-[44px] sm:min-h-[36px] text-center rounded-lg border text-brand-blue font-semibold text-sm transition-all outline-none
          focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-1 focus:outline-none
          ${shake ? 'shake border-rose-400 ring-1 ring-rose-400/40' : 'border-stone-200 hover:border-stone-300 focus:border-brand-blue/50 focus:ring-1 focus:ring-brand-blue/20'}
          ${disabled ? 'opacity-40 cursor-not-allowed bg-stone-50' : 'bg-white'}
        `}
        onChange={e => setLocal(e.target.value)}
        onBlur={e => commit(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter') commit(e.target.value); }}
      />
      <span className="text-stone-400">мм</span>
    </label>
  );
}

export default function GridParams() {
  const gridType       = useRulingStore(s => s.gridType);
  const gridStep       = useRulingStore(s => s.gridStep);
  const lineThick      = useRulingStore(s => s.lineThick);
  const lineStyle      = useRulingStore(s => s.lineStyle);
  const showHeaders    = useRulingStore(s => s.showHeaders);
  const setGridStep    = useRulingStore(s => s.setGridStep);
  const setLineThick   = useRulingStore(s => s.setLineThick);
  const setLineStyle   = useRulingStore(s => s.setLineStyle);
  const setShowHeaders = useRulingStore(s => s.setShowHeaders);

  return (
    <section>
      <p className="text-[11px] font-bold text-stone-500 uppercase mb-2">Параметры</p>
      <div className="flex items-center gap-5 flex-wrap">
        <NumInput
          label="Шаг"
          value={gridStep}
          min={2}
          max={20}
          step={0.5}
          disabled={FIXED_STEP_TYPES.includes(gridType)}
          onChange={setGridStep}
        />
        <NumInput
          label="Толщина"
          value={lineThick}
          min={0.1}
          max={1.0}
          step={0.05}
          disabled={false}
          onChange={setLineThick}
        />
        <label className="flex flex-col gap-1.5 text-xs text-stone-600 select-none">
          Стиль
          <select
            value={lineStyle}
            onChange={e => setLineStyle(e.target.value)}
            className="h-[44px] sm:h-[36px] px-2 rounded-lg border border-stone-200 text-brand-blue font-semibold text-sm transition-all focus:border-brand-blue/50 focus:ring-1 focus:ring-brand-blue/20 outline-none cursor-pointer"
          >
            <option value="solid">Сплошная</option>
            <option value="dashed">Пунктир</option>
            <option value="dotted">Точки</option>
          </select>
        </label>
        <label className="flex items-center gap-2 text-xs text-stone-600 select-none cursor-pointer mt-4 sm:mt-0">
          <input
            type="checkbox"
            checked={showHeaders}
            onChange={e => setShowHeaders(e.target.checked)}
            className="w-4 h-4 rounded border-stone-300 text-brand-blue focus:ring-brand-blue/20 cursor-pointer"
          />
          Шапка ученика (ФИО)
        </label>
      </div>
    </section>
  );
}
