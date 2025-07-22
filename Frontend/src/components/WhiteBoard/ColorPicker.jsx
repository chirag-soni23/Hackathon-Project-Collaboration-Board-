const ColorPicker = ({ colors, selectedColor, onSelect }) => (
  <div className="flex gap-2 p-2 bg-white/10 backdrop-blur-xl shadow-lg rounded-xl fixed bottom-20 left-1/2 -translate-x-1/2 z-50 border border-white/20">
    {colors.map((color) => (
      <button
        key={color}
        onClick={() => onSelect(color)}
        className={`w-6 h-6 rounded-full border-2 ${
          selectedColor === color ? "border-white" : "border-transparent"
        }`}
        style={{ backgroundColor: color }}
      />
    ))}
  </div>
);

export default ColorPicker;
