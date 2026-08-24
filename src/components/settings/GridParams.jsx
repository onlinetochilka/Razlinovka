import { useState, useRef, useCallback } from 'react';
import { useRulingStore } from '../../store/useRulingStore';
import { FIXED_STEP_TYPES } from '../../utils/constants';

function NumInput({ value, min, max, step, disabled, onChange, label }) {
  // Убираем возможный float-мусор (например, 0.300000000004) при инициализации
  const cleanValue = Number(value.toFixed(3));
  const [local, setLocal] = useState(String(cleanValue));
  const [shake, setShake] = useState(false);
  const timer = useRef(null);

  const prevVal = useRef(value);
  if (prevVal.current !== value) {
    prevVal.current = value;
    setLocal(String(Number(value.toFixed(3))));
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
    setLocal(String(Number(n.toFixed(3))));
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
  const gridType     = useRulingStore(s => s.gridType);
  const gridStep     = useRulingStore(s => s.gridStep);
  const lineThick    = useRulingStore(s => s.lineThick);
  const setGridStep  = useRulingStore(s => s.setGridStep);
  const setLineThick = useRulingStore(s => s.setLineThick);

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
      </div>
    </section>
  );
}
