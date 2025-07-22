// inside Whiteboard.jsx
import { useRef, useState, useEffect } from "react";
import { Stage, Layer, Line, Rect, Text, Group } from "react-konva";
import {
  Pencil,
  StickyNote,
  Eraser,
  MousePointer2,
  Trash,
} from "lucide-react";
import { useStickyNotes } from "../context/StickyNoteContext";

const Whiteboard = () => {
  const stageRef = useRef();
  const [tool, setTool] = useState("select");
  const [drawColor, setDrawColor] = useState("#ffffff");
  const [noteColor, setNoteColor] = useState("#FEF9C3");
  const [isDrawing, setIsDrawing] = useState(false);
  const [lines, setLines] = useState([]);
  const [stageScale, setStageScale] = useState(1);
  const [stagePos, setStagePos] = useState({ x: 0, y: 0 });
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [textAreaValue, setTextAreaValue] = useState("");
  const [textAreaStyle, setTextAreaStyle] = useState({});
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [eraserSize, setEraserSize] = useState(20);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  const { notes, createNote, updateNote, deleteNote, fetchNotes } =
    useStickyNotes();

  useEffect(() => {
    fetchNotes();
  }, []);

  const addStickyNote = async (color) => {
    const newNote = {
      text: "",
      x: Math.random() * (window.innerWidth - 250) + 50,
      y: Math.random() * (window.innerHeight - 200) + 50,
      color,
    };
    await createNote(newNote);
  };

  const handleToolClick = (t) => {
    if (tool === t.name) setShowColorPicker(false);
    else {
      setTool(t.name);
      setShowColorPicker(t.name === "marker" || t.name === "sticky");
    }
  };

  const handleMouseDown = (e) => {
    if (tool === "marker" || tool === "eraser") {
      setIsDrawing(true);
      const pos = e.target.getStage().getPointerPosition();
      const newLine = {
        tool,
        color: drawColor,
        size: eraserSize,
        points: [pos.x, pos.y],
      };
      setLines([...lines, newLine]);
    }
  };

  const handleMouseMove = (e) => {
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    if (point) setCursorPos({ x: point.x, y: point.y });

    if (!isDrawing) return;

    const updatedLines = [...lines];
    const lastLine = updatedLines[updatedLines.length - 1];
    lastLine.points = [...lastLine.points, point.x, point.y];
    updatedLines[updatedLines.length - 1] = lastLine;
    setLines(updatedLines);
  };

  const handleMouseUp = () => setIsDrawing(false);

  const handleWheel = (e) => {
    e.evt.preventDefault();
    const scaleBy = 1.05;
    const stage = stageRef.current;
    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();
    const direction = e.evt.deltaY > 0 ? 1 / scaleBy : scaleBy;
    const newScale = oldScale * direction;

    setStageScale(newScale);
    setStagePos({
      x: -(pointer.x / oldScale - stage.x() / oldScale) * newScale + pointer.x,
      y: -(pointer.y / oldScale - stage.y() / oldScale) * newScale + pointer.y,
    });
  };

  const handleTextAreaBlur = () => {
    if (editingNote) {
      updateNote(editingNote._id, { text: textAreaValue });
      setEditingNote(null);
    }
  };

  // Group notes by user
  const notesByUser = {};
  notes.forEach((note) => {
    const name = note?.user?.name || "Unknown";
    if (!notesByUser[name]) notesByUser[name] = [];
    notesByUser[name].push(note);
  });

  return (
    <div
      className={`w-screen h-screen bg-[radial-gradient(circle,_grey_1px,_transparent_1px)] bg-[#0f172a] [background-size:20px_20px] relative overflow-hidden ${
        tool === "marker"
          ? "cursor-crosshair"
          : tool === "select"
          ? "cursor-default"
          : "cursor-none"
      }`}
    >
      {/* Toolbar */}
      <div className="flex gap-2 p-2 bg-white/10 backdrop-blur-xl rounded-xl shadow-md fixed bottom-4 left-1/2 -translate-x-1/2 z-50 border border-white/20">
        {[
          { name: "select", icon: <MousePointer2 size={20} /> },
          { name: "marker", icon: <Pencil size={20} /> },
          { name: "eraser", icon: <Eraser size={20} /> },
          { name: "sticky", icon: <StickyNote size={20} /> },
        ].map((t) => (
          <button
            key={t.name}
            onClick={() => handleToolClick(t)}
            className={`p-2 rounded-lg transition-colors duration-200 ${
              tool === t.name
                ? "bg-purple-600 text-white"
                : "text-white hover:bg-white/20"
            }`}
          >
            {t.icon}
          </button>
        ))}
        <button
          disabled={!selectedNoteId}
          onClick={() => {
            if (selectedNoteId) {
              deleteNote(selectedNoteId);
              setSelectedNoteId(null);
            }
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

      {/* Color Pickers */}
      {showColorPicker && tool === "marker" && (
        <div className="flex gap-2 p-2 bg-white/10 backdrop-blur-xl shadow-lg rounded-xl fixed bottom-20 left-1/2 -translate-x-1/2 z-50 border border-white/20">
          {["#ffffff", "#EF4444", "#F59E0B", "#10B981", "#3B82F6", "#8B5CF6"].map(
            (color) => (
              <button
                key={color}
                onClick={() => setDrawColor(color)}
                className={`w-6 h-6 rounded-full border-2 ${
                  drawColor === color ? "border-white" : "border-transparent"
                }`}
                style={{ backgroundColor: color }}
              />
            )
          )}
        </div>
      )}

      {tool === "eraser" && (
        <div className="flex gap-2 items-center p-2 bg-white/10 backdrop-blur-xl shadow-lg rounded-xl fixed bottom-20 left-1/2 -translate-x-1/2 z-50 text-white text-sm border border-white/20">
          <span className="font-medium">Eraser Size:</span>
          <input
            type="range"
            min="5"
            max="100"
            value={eraserSize}
            onChange={(e) => setEraserSize(Number(e.target.value))}
            className="w-32 accent-purple-500"
          />
          <span>{eraserSize}px</span>
        </div>
      )}

      {showColorPicker && tool === "sticky" && (
        <div className="flex gap-2 p-2 bg-white/10 backdrop-blur-xl shadow-lg rounded-xl fixed bottom-20 left-1/2 -translate-x-1/2 z-50 border border-white/20">
          {["#FEF9C3", "#FCD34D", "#FDBA74", "#A7F3D0", "#BFDBFE", "#DDD6FE"].map(
            (color) => (
              <button
                key={color}
                onClick={() => addStickyNote(color)}
                className={`w-6 h-6 rounded-full border-2 ${
                  noteColor === color ? "border-white" : "border-transparent"
                }`}
                style={{ backgroundColor: color }}
              />
            )
          )}
        </div>
      )}

      {/* Stage and Layers */}
      <Stage
        ref={stageRef}
        width={window.innerWidth}
        height={window.innerHeight}
        draggable={tool === "select"}
        scaleX={stageScale}
        scaleY={stageScale}
        x={stagePos.x}
        y={stagePos.y}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMousemove={handleMouseMove}
        onMouseup={handleMouseUp}
      >
        {/* Connector Lines Layer */}
      <Layer>
  {Object.entries(notesByUser).map(([name, userNotes]) => {
    if (userNotes.length < 2) return null;

    // Optional: sort by x/y to make the lines cleaner
    const sorted = [...userNotes].sort((a, b) => a.x - b.x);

    const lines = [];
    for (let i = 0; i < sorted.length - 1; i++) {
      const from = sorted[i];
      const to = sorted[i + 1];

      const fromX = from.x + 100; // center of note
      const fromY = from.y + 110; // vertical center

      const toX = to.x + 100;
      const toY = to.y + 110;

      lines.push(
        <Line
          key={`${from._id}-${to._id}`}
          points={[fromX, fromY, toX, toY]}
          stroke="white"
          strokeWidth={2}
          lineCap="round"
        />
      );
    }

    return lines;
  })}
</Layer>


        {/* Sticky Notes */}
        <Layer>
          {notes.map((note) => (
            <Group
              key={note._id}
              x={note.x}
              y={note.y}
              draggable={
                tool === "select" &&
                !(editingNote && editingNote._id === note._id)
              }
              onDragEnd={(e) => {
                const { x, y } = e.target.position();
                updateNote(note._id, { x, y });
              }}
              onClick={() =>
                setSelectedNoteId((prev) =>
                  prev === note._id ? null : note._id
                )
              }
              onDblClick={() => {
                const stage = stageRef.current;
                const transform = stage.getAbsoluteTransform().copy().invert();
                const pos = transform.point({ x: note.x + 10, y: note.y + 10 });

                setEditingNote(note);
                setTextAreaValue(note.text);
                setTextAreaStyle({
                  position: "absolute",
                  top: pos.y,
                  left: pos.x,
                  width: 180,
                  height: 160,
                  fontSize: "16px",
                  padding: "8px",
                  background: note.color,
                  color: "#111827",
                  zIndex: 1000,
                  borderRadius: "8px",
                  resize: "none",
                  overflow: "auto",
                  lineHeight: "1.4",
                });
              }}
            >
              <Rect
                width={200}
                height={220}
                fill={note.color}
                cornerRadius={8}
                stroke={note._id === selectedNoteId ? "blue" : ""}
                strokeWidth={note._id === selectedNoteId ? 4 : 0}
              />
              <Group clip={{ x: 10, y: 10, width: 180, height: 160 }}>
                <Text
                  text={note.text}
                  x={10}
                  y={10}
                  width={180}
                  height={160}
                  fontSize={16}
                  fill="#111827"
                  wrap="word"
                />
              </Group>
              <Text
                text={`~ ${note?.user?.name || "Unknown"}`}
                x={10}
                y={180}
                width={180}
                height={30}
                fontSize={12}
                fill="#4B5563"
              />
            </Group>
          ))}
        </Layer>

        {/* Drawing Layer */}
        <Layer>
          {lines.map((line, i) => (
            <Line
              key={i}
              points={line.points}
              stroke={line.tool === "eraser" ? "black" : line.color}
              strokeWidth={line.tool === "eraser" ? line.size : 2}
              tension={0.5}
              lineCap="round"
              globalCompositeOperation={
                line.tool === "eraser" ? "destination-out" : "source-over"
              }
            />
          ))}
        </Layer>
      </Stage>

      {/* Text Editor */}
      {editingNote && (
        <textarea
          value={textAreaValue}
          onChange={(e) => setTextAreaValue(e.target.value)}
          onBlur={handleTextAreaBlur}
          autoFocus
          className="outline-none border-none resize-none"
          style={textAreaStyle}
        />
      )}

      {/* Custom Cursor for Eraser */}
      {tool === "eraser" && (
        <div
          className="fixed z-50 pointer-events-none transition-transform duration-75"
          style={{
            left: `${cursorPos.x - eraserSize / 2}px`,
            top: `${cursorPos.y - eraserSize / 2}px`,
            width: `${eraserSize}px`,
            height: `${eraserSize}px`,
          }}
        >
          <div className="w-full h-full bg-white/10 border border-white rounded-full flex items-center justify-center">
            <Eraser size={eraserSize / 2} className="text-white opacity-70" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Whiteboard;
