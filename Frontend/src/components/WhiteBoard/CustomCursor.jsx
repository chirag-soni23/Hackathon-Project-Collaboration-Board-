import { Eraser } from "lucide-react";

const CustomCursor = ({ pos, size }) => (
  <div
    className="fixed z-50 pointer-events-none transition-transform duration-75"
    style={{
      left: `${pos.x - size / 2}px`,
      top: `${pos.y - size / 2}px`,
      width: `${size}px`,
      height: `${size}px`,
    }}
  >
    <div className="w-full h-full bg-white/10 border border-white rounded-full flex items-center justify-center">
      <Eraser size={size / 2} className="text-white opacity-70" />
    </div>
  </div>
);

export default CustomCursor;
