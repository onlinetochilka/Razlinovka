import { useRulingStore } from '../../store/useRulingStore';

const SIZES = ['A4', 'A5', 'A3'];

export default function PaperSizeSelector() {
  const paperSize    = useRulingStore(s => s.paperSize);
  const setPaperSize = useRulingStore(s => s.setPaperSize);

  return (
    <section>
      <p className="text-[11px] font-bold text-stone-500 uppercase mb-2">Формат бумаги</p>
      <div className="grid grid-cols-3 gap-1.5">
        {SIZES.map(size => (
          <button
            key={size}
            onClick={() => setPaperSize(size)}
            className={`h-9 rounded-lg text-xs font-medium transition-all ${
              paperSize === size
                ? 'bg-amber-50 text-amber-700 ring-1 ring-amber-500/30'
                : 'bg-white text-stone-600 ring-1 ring-stone-200 hover:bg-stone-50 hover:text-stone-900'
            }`}
          >
            {size}
          </button>
        ))}
      </div>
    </section>
  );
}
