import { useRef } from 'react';
import { useRulingStore } from '../../store/useRulingStore';
import { COLOR_PRESETS } from '../../utils/constants';
import { track } from '../../utils/analytics';

function isValidHex(hex) {
  return /^#[0-9A-Fa-f]{6}$/.test(hex);
}

export default function ColorPicker() {
  const lineColor    = useRulingStore(s => s.lineColor);
  const setLineColor = useRulingStore(s => s.setLineColor);
  const nativeRef    = useRef(null);

  const isCustom = !COLOR_PRESETS.some(p => p.hex.toLowerCase() === lineColor.toLowerCase());

  const handleHexChange = (e) => {
    const v = e.target.value.trim();
    setLineColor(v);
  };

  const handlePresetClick = (hex) => {
    setLineColor(hex);
    track('color_changed', { color: hex, source: 'preset' });
  };

  const handleNativeChange = (e) => {
    setLineColor(e.target.value);
    track('color_changed', { color: e.target.value, source: 'custom' });
  };

  return (
    <section>
      <div className="flex items-center justify-between mb-2">
        <p className="text-[11px] font-bold text-stone-500 uppercase">Цвет линий</p>
        <input
          type="text"
          value={lineColor}
          onChange={handleHexChange}
          maxLength={7}
          spellCheck={false}
          className="w-[4.5rem] h-6 text-center rounded-md border border-stone-200 font-mono text-brand-blue text-xs font-bold bg-white focus:outline-none focus:border-brand-blue/50"
        />
      </div>
      <div className="flex items-center gap-2">
        {COLOR_PRESETS.map(({ hex, label }) => (
          <button
            key={hex}
            title={label}
            onClick={() => handlePresetClick(hex)}
            style={{ background: hex }}
            className={`w-7 h-7 rounded-full transition-all ${
              lineColor.toLowerCase() === hex.toLowerCase()
                ? 'ring-2 ring-offset-2 ring-brand-blue scale-110'
                : 'ring-1 ring-black/10 hover:scale-110'
            }`}
          />
        ))}

        <button
          title="Свой цвет"
          onClick={() => nativeRef.current?.click()}
          className={`w-7 h-7 rounded-full ring-1 ring-stone-200 flex items-center justify-center bg-white hover:bg-stone-50 transition-all overflow-hidden relative ${
            isCustom ? 'ring-2 ring-offset-2 ring-brand-blue' : ''
          }`}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-stone-500 pointer-events-none">
            <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>
            <circle cx="6.5" cy="11.5" r="1" fill="currentColor" stroke="none"/>
            <circle cx="8" cy="7" r="1" fill="currentColor" stroke="none"/>
            <circle cx="12" cy="5.5" r="1" fill="currentColor" stroke="none"/>
            <circle cx="16" cy="7" r="1" fill="currentColor" stroke="none"/>
            <circle cx="18" cy="11.5" r="1" fill="currentColor" stroke="none"/>
          </svg>
          <input
            ref={nativeRef}
            type="color"
            value={isValidHex(lineColor) ? lineColor : '#94a3b8'}
            onChange={handleNativeChange}
            className="absolute opacity-0 w-full h-full inset-0 cursor-pointer"
          />
        </button>
      </div>
    </section>
  );
}
