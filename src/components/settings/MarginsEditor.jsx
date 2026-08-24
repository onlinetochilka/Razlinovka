import { useState, useRef } from 'react';
import { useRulingStore } from '../../store/useRulingStore';

const FIELDS = [
  { key: 'top',    label: 'Верхнее' },
  { key: 'right',  label: 'Правое'  },
  { key: 'bottom', label: 'Нижнее'  },
  { key: 'left',   label: 'Левое'   },
];

function MarginInput({ marginKey, label }) {
  const value     = useRulingStore(s => s.margins[marginKey]);
  const setMargin = useRulingStore(s => s.setMargin);
  const getMax    = useRulingStore(s => s.getMarginMax);
  const [shake, setShake] = useState(false);
  const timer = useRef(null);

  const triggerShake = () => {
    setShake(false);
    requestAnimationFrame(() => requestAnimationFrame(() => setShake(true)));
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setShake(false), 400);
  };

  const handleChange = (e) => {
    const n = Number(e.target.value);
    const max = getMax(marginKey);
    if (isNaN(n) || n < 0 || n > max) {
      triggerShake();
      return;
    }
    setMargin(marginKey, n);
  };

  return (
    <label className="flex flex-col gap-0.5">
      <span className="text-[10px] text-stone-400 font-medium">{label}</span>
      <input
        type="number"
        min={0}
        step={1}
        value={value}
        onChange={handleChange}
        className={`w-full h-8 text-center rounded-lg border text-brand-blue font-semibold text-sm outline-none bg-white transition-all
          ${shake ? 'shake border-rose-400 ring-1 ring-rose-400/40' : 'border-stone-200 hover:border-stone-300 focus:border-brand-blue/50 focus:ring-1 focus:ring-brand-blue/20'}
        `}
      />
    </label>
  );
}

export default function MarginsEditor() {
  const _savedMargins = useRulingStore(s => s._savedMargins);
  const resetMargins  = useRulingStore(s => s.resetMargins);
  const noMargins     = _savedMargins !== null;

  return (
    <section>
      <div className="flex items-center justify-between mb-2">
        <p className="text-[11px] font-bold text-stone-500 uppercase">Поля (мм)</p>
        <button
          onClick={resetMargins}
          className={`h-5 px-2 rounded text-[10px] font-medium transition-all ${
            noMargins
              ? 'bg-rose-50 text-rose-600 ring-1 ring-rose-300/50'
              : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
          }`}
        >
          Без полей
        </button>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {FIELDS.map(({ key, label }) => (
          <MarginInput key={key} marginKey={key} label={label} />
        ))}
      </div>
    </section>
  );
}
