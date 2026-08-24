import { useRulingStore } from '../../store/useRulingStore';
import { GRID_TYPES, FIXED_STEP_TYPES, SCHOOL_MARGIN_TYPES } from '../../utils/constants';
import { track } from '../../utils/analytics';

const FIXED_BADGES = {
  millimeter: '1/5/10 мм',
  slanted:    '4+8 мм',
  frequent:   '4+8 мм',
  notes:      '2+12 мм',
};

export default function GridTypeSelector() {
  const gridType         = useRulingStore(s => s.gridType);
  const setGridType      = useRulingStore(s => s.setGridType);
  const schoolMargins    = useRulingStore(s => s.schoolMargins);
  const setSchoolMargins = useRulingStore(s => s.setSchoolMargins);

  const showToggle = SCHOOL_MARGIN_TYPES.includes(gridType);

  return (
    <section>
      <div className="flex items-center justify-between mb-2">
        <p className="text-[11px] font-bold text-stone-500 uppercase">Тип сетки</p>
        {showToggle && (
          <label className="flex items-center gap-1.5 cursor-pointer select-none">
            <span className="text-[10px] font-medium text-stone-500">Поля</span>
            <button
              role="switch"
              aria-checked={schoolMargins}
              onClick={() => {
                const next = !schoolMargins;
                setSchoolMargins(next);
                track('school_margins_toggled', { enabled: next, gridType });
              }}
              className={`relative inline-flex h-4 w-7 items-center rounded-full transition-colors ${
                schoolMargins ? 'bg-rose-400' : 'bg-stone-200'
              }`}
            >
              <span className={`inline-block h-3 w-3 transform rounded-full bg-white shadow transition-transform ${
                schoolMargins ? 'translate-x-3.5' : 'translate-x-0.5'
              }`} />
            </button>
          </label>
        )}
      </div>
      <div className="grid grid-cols-2 gap-1.5" role="group" aria-label="Тип сетки">
        {GRID_TYPES.map(({ id, label }) => {
          const isActive = gridType === id;
          const badge    = FIXED_BADGES[id];
          return (
            <button
              key={id}
              onClick={() => { setGridType(id); track('grid_type_changed', { gridType: id }); }}
              aria-pressed={isActive}
              className={`min-h-[44px] sm:min-h-[36px] rounded-lg text-xs font-medium flex flex-col items-center justify-center leading-tight transition-all
                focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-1 focus:outline-none
                ${
                isActive
                  ? 'bg-violet-50 text-violet-700 ring-1 ring-violet-500/30'
                  : 'bg-white text-stone-600 ring-1 ring-stone-200 hover:bg-stone-50 hover:text-stone-900'
              }`}
            >
              <span>{label}</span>
              {badge && (
                <span className={`text-[9px] font-normal ${isActive ? 'text-violet-500/70' : 'text-stone-400'}`}>
                  {badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
