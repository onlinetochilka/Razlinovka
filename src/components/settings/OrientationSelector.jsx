import { useRulingStore } from '../../store/useRulingStore';
import { track } from '../../utils/analytics';

const OPTIONS = [
  { id: 'portrait',  label: 'Книжная',
    icon: (<svg width='14' height='20' viewBox='0 0 14 20' fill='none'><rect x='0.5' y='0.5' width='13' height='19' rx='1.5' stroke='currentColor' strokeWidth='1.2' /></svg>) },
  { id: 'landscape', label: 'Альбомная',
    icon: (<svg width='20' height='14' viewBox='0 0 20 14' fill='none'><rect x='0.5' y='0.5' width='19' height='13' rx='1.5' stroke='currentColor' strokeWidth='1.2' /></svg>) },
];

export default function OrientationSelector() {
  const orientation    = useRulingStore(s => s.orientation);
  const setOrientation = useRulingStore(s => s.setOrientation);
  return (
    <section>
      <p className='text-[11px] font-bold text-stone-500 uppercase mb-2'>Ориентация</p>
      <div className='grid grid-cols-2 gap-1.5' role="group" aria-label="Ориентация страницы">
        {OPTIONS.map(({ id, label, icon }) => (
          <button key={id} onClick={() => { setOrientation(id); track('orientation_changed', { orientation: id }); }}
            aria-pressed={orientation === id}
            className={`min-h-[44px] sm:min-h-[36px] rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-all
              focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-1 focus:outline-none
              ${orientation === id ? 'bg-stone-800 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'}`}>{icon}{label}</button>
        ))}
      </div>
    </section>
  );
}