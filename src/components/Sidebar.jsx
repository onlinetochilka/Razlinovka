import PaperSizeSelector  from './settings/PaperSizeSelector';
import OrientationSelector from './settings/OrientationSelector';
import GridTypeSelector    from './settings/GridTypeSelector';
import GridParams          from './settings/GridParams';
import ColorPicker         from './settings/ColorPicker';
import MarginsEditor       from './settings/MarginsEditor';
import DownloadMenu        from './DownloadMenu';

export default function Sidebar({ svgRef }) {
  return (
    <div className="relative flex flex-col lg:h-full lg:flex-shrink-0 z-10 w-full lg:w-[clamp(380px,27vw,450px)] lg:min-w-[380px] print:hidden">
      <aside className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 flex flex-col lg:h-full">

        {/* Header */}
        <header className="flex items-center p-4 border-b border-stone-200/50">
          <img
            src="https://raw.githubusercontent.com/onlinetochilka/theme/main/tochilka-logo.svg"
            className="w-11 h-11 mr-3"
            alt="Логотип Точилки"
          />
          <div>
            <h1 className="text-base font-semibold text-stone-900 leading-snug">Разлиновка</h1>
            <div className="text-xs font-medium text-stone-500">Идеальные рабочие листы</div>
          </div>
        </header>

        {/* Scrollable settings */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
          <PaperSizeSelector />
          <OrientationSelector />
          <GridTypeSelector />
          <GridParams />
          <ColorPicker />
          <MarginsEditor />
        </div>

        {/* Footer */}
        <footer className="p-4 border-t border-stone-200/50 bg-stone-50/50 flex gap-2">
          <DownloadMenu svgRef={svgRef} />
          <button
            onClick={() => window.print()}
            className="flex-1 h-12 rounded-xl bg-brand-blue text-white font-semibold text-sm flex items-center justify-center gap-2 hover:bg-[#005270] shadow-[0_4px_14px_rgba(0,101,132,0.30)] transition-all active:scale-[0.98]"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 6 2 18 2 18 9"/>
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
              <rect x="6" y="14" width="12" height="8"/>
            </svg>
            Распечатать
          </button>
        </footer>

      </aside>
    </div>
  );
}
