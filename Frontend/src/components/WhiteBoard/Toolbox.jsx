import { Pencil, StickyNote, Eraser, MousePointer2, Trash } from "lucide-react";

const tools = [
  { name: "select", icon: <MousePointer2 size={20} /> },
  { name: "marker", icon: <Pencil size={20} /> },
  { name: "eraser", icon: <Eraser size={20} /> },
  { name: "sticky", icon: <StickyNote size={20} /> },
];

const Toolbar = ({ tool, setTool, selectedNoteId, deleteNote, setShowColorPicker }) => {
  const handleToolClick = (name) => {
    if (tool === name) setShowColorPicker(false);
    else {
      setTool(name);
      setShowColorPicker(name === "marker" || name === "sticky");
    }
  };

  return (
    <div className="flex gap-2 p-2 bg-white/10 backdrop-blur-xl rounded-xl shadow-md fixed bottom-4 left-1/2 -translate-x-1/2 z-50 border border-white/20">
      {tools.map((t) => (
        <button
          key={t.name}
          onClick={() => handleToolClick(t.name)}
          className={`p-2 rounded-lg transition-colors duration-200 ${
            tool === t.name ? "bg-purple-600 text-white" : "text-white hover:bg-white/20"
          }`}
        >
          {t.icon}
        </button>
      ))}
      <button
        disabled={!selectedNoteId}
        onClick={() => {
          if (selectedNoteId) deleteNote(selectedNoteId);
        }}
        className={`p-2 rounded-lg transition-colors duration-200 ${
          selectedNoteId
            ? "bg-red-600 text-white hover:bg-red-700"
            : "text-white opacity-30 cursor-not-allowed"
        }`}
      >
        <Trash size={20} />
      </button>
    </div>
  );
};

export default Toolbar;
