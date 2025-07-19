import React, { useRef, useState } from "react";
import { Stage, Layer, Line, Rect, Text, Group } from "react-konva";
import { Pencil, StickyNote, Eraser, MousePointer2 } from "lucide-react";

const Whiteboard = () => {
  const stageRef = useRef();
  const [tool, setTool] = useState("select");
  const [drawColor, setDrawColor] = useState("#000000");
  const [noteColor, setNoteColor] = useState("#FEF9C3");
  const [isDrawing, setIsDrawing] = useState(false);
  const [lines, setLines] = useState([]);
  const [notes, setNotes] = useState([]);
  const [stageScale, setStageScale] = useState(1);
  const [stagePos, setStagePos] = useState({ x: 0, y: 0 });
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [textAreaValue, setTextAreaValue] = useState("");
  const [textAreaStyle, setTextAreaStyle] = useState({});

  const colorOptions = [
    "#000000",
    "#EF4444",
    "#F59E0B",
    "#10B981",
    "#3B82F6",
    "#8B5CF6",
  ];
  const noteColors = [
    "#FEF9C3",
    "#FCD34D",
    "#FDBA74",
    "#A7F3D0",
    "#BFDBFE",
    "#DDD6FE",
  ];

  const addStickyNote = () => {
    const newNote = {
      id: Date.now(),
      x: Math.random() * (window.innerWidth - 250) + 50,
      y: Math.random() * (window.innerHeight - 200) + 50,
      width: 200,
      height: 220,
      text: "",
      color: noteColor,
    };
    setNotes((prev) => [...prev, newNote]);
  };

  const handleToolClick = (t) => {
    if (tool === t.name) {
      setShowColorPicker(false);
    } else {
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
        points: [pos.x, pos.y],
      };
      setLines([...lines, newLine]);
    }
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    const updatedLines = lines.slice();
    const lastLine = updatedLines[updatedLines.length - 1];
    lastLine.points = [...lastLine.points, point.x, point.y];
    updatedLines[updatedLines.length - 1] = lastLine;
    setLines(updatedLines);
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

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
    if (!editingNote) return;
    setNotes((prevNotes) =>
      prevNotes.map((n) =>
        n.id === editingNote.id ? { ...n, text: textAreaValue } : n
      )
    );
    setEditingNote(null);
  };

  return (
    <div
      className={`w-screen h-screen bg-[radial-gradient(circle,_black_1px,_transparent_1px)]
 [background-size:20px_20px] relative overflow-hidden ${
   tool === "eraser"
     ? "cursor-eraser"
     : tool === "marker"
     ? "cursor-crosshair"
     : "cursor-default"
 }`}
    >
      {/* Toolbox */}
      <div className="flex gap-2 p-2 bg-white rounded-xl shadow-md fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
        {[
          {
            name: "select",
            icon: <MousePointer2 size={20} />,
            label: "Select",
          },
          { name: "marker", icon: <Pencil size={20} />, label: "Marker" },
          { name: "eraser", icon: <Eraser size={20} />, label: "Eraser" },
          {
            name: "sticky",
            icon: <StickyNote size={20} />,
            label: "Sticky Note",
          },
        ].map((t) => (
          <button
            key={t.name}
            onClick={() => handleToolClick(t)}
            className={`p-2 rounded-lg transition-colors duration-200 ${
              tool === t.name
                ? "bg-purple-500 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
            title={t.label}
          >
            {t.icon}
          </button>
        ))}
      </div>

      {/* Marker Color Picker */}
      {showColorPicker && tool === "marker" && (
        <div className="flex gap-2 p-2 bg-white shadow-lg rounded-xl fixed bottom-20 left-1/2 -translate-x-1/2 z-50">
          {colorOptions.map((color) => (
            <button
              key={color}
              onClick={() => setDrawColor(color)}
              className={`w-6 h-6 rounded-full border-2 ${
                drawColor === color ? "border-black" : "border-transparent"
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      )}

      {showColorPicker && tool === "sticky" && (
        <div className="flex gap-2 p-2 bg-white shadow-lg rounded-xl fixed bottom-20 left-1/2 -translate-x-1/2 z-50">
          {noteColors.map((color) => (
            <button
              key={color}
              onClick={() => {
                setNoteColor(color);
                addStickyNote();
              }}
              className={`w-6 h-6 rounded-full border-2 ${
                noteColor === color ? "border-black" : "border-transparent"
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      )}

      {/* Canvas */}
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
        {/* Sticky Notes Layer */}
        <Layer>
          {notes.map((note) => (
            <Group
              key={note.id}
              x={note.x}
              y={note.y}
              draggable={
                tool === "select" &&
                !(editingNote && editingNote.id === note.id)
              }
              onDragEnd={(e) => {
                const { x, y } = e.target.position();
                setNotes((prev) =>
                  prev.map((n) => (n.id === note.id ? { ...n, x, y } : n))
                );
              }}
            >
              <Rect
                width={note.width}
                height={note.height}
                fill={note.color}
                shadowBlur={5}
              />
              <Text
                text={note.text}
                x={10}
                y={10}
                width={note.width - 20}
                height={note.height - 20}
                fontSize={16}
                fill="#111827"
                wrap="word"
                ellipsis
                onDblClick={() => {
                  const stage = stageRef.current;
                  const transform = stage
                    .getAbsoluteTransform()
                    .copy()
                    .invert();
                  const pos = transform.point({
                    x: note.x + 10,
                    y: note.y + 10,
                  });

                  setEditingNote(note);
                  setTextAreaValue(note.text);
                  setTextAreaStyle({
                    position: "absolute",
                    top: pos.y,
                    left: pos.x,
                    width: note.width - 20,
                    height: note.height - 20,
                    fontSize: "16px",
                    padding: "8px",
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                    background: note.color,
                    color: "#111827",
                    zIndex: 1000,
                    resize: "none",
                  });
                }}
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
              strokeWidth={line.tool === "eraser" ? 20 : 2}
              tension={0.5}
              lineCap="round"
              globalCompositeOperation={
                line.tool === "eraser" ? "destination-out" : "source-over"
              }
            />
          ))}
        </Layer>
      </Stage>

      {editingNote && (
        <textarea
          value={textAreaValue}
          onChange={(e) => setTextAreaValue(e.target.value)}
          onBlur={handleTextAreaBlur}
          autoFocus
          className="outline-none border-none resize-none"
          style={{
            ...textAreaStyle,
            border: "none",
            outline: "none",
            resize: "none",
          }}
        />
      )}
    </div>
  );
};

export default Whiteboard;
