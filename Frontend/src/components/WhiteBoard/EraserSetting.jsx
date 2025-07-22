const EraserSettings = ({ size, onChange }) => (
  <div className="flex gap-2 items-center p-2 bg-white/10 backdrop-blur-xl shadow-lg rounded-xl fixed bottom-20 left-1/2 -translate-x-1/2 z-50 text-white text-sm border border-white/20">
    <span className="font-medium">Eraser Size:</span>
    <input
      type="range"
      min="5"
      max="100"
      value={size}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-32 accent-purple-500"
    />
    <span>{size}px</span>
  </div>
);

export default EraserSettings;
