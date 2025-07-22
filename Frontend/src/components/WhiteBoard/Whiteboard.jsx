import { useRef, useState, useEffect } from "react";
import { Stage } from "react-konva";
import { useStickyNotes } from "../../context/StickyNoteContext";

import Toolbar from "./Toolbox";
import ColorPicker from "./ColorPicker";
import EraserSettings from "./EraserSetting";
import DrawingLayer from "./DrawingLayer";
import StickyNotesLayer from "./StickyNotesLayer";
import ConnectorLinesLayer from "./ConnectorLinesLayer";
import CustomCursor from "./CustomCursor";
import TextEditor from "./TextEditor";

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

  const addStickyNote = async (color) => {
    const newNote = {
      text: "",
      x: Math.random() * (window.innerWidth - 250) + 50,
      y: Math.random() * (window.innerHeight - 200) + 50,
      color,
    };
    await createNote(newNote);
  };

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
      <Toolbar
        tool={tool}
        setTool={setTool}
        selectedNoteId={selectedNoteId}
        deleteNote={deleteNote}
        setShowColorPicker={setShowColorPicker}
      />

      {showColorPicker && tool === "marker" && (
        <ColorPicker
          colors={[
            "#ffffff",
            "#EF4444",
            "#F59E0B",
            "#10B981",
            "#3B82F6",
            "#8B5CF6",
          ]}
          selectedColor={drawColor}
          onSelect={setDrawColor}
        />
      )}

      {tool === "eraser" && (
        <EraserSettings size={eraserSize} onChange={setEraserSize} />
      )}

      {showColorPicker && tool === "sticky" && (
        <ColorPicker
          colors={[
            "#FEF9C3",
            "#FCD34D",
            "#FDBA74",
            "#A7F3D0",
            "#BFDBFE",
            "#DDD6FE",
          ]}
          selectedColor={noteColor}
          onSelect={(color) => {
            setNoteColor(color);
            addStickyNote(color);
          }}
        />
      )}

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
        <ConnectorLinesLayer notesByUser={notesByUser} />

        <StickyNotesLayer
          notes={notes}
          tool={tool}
          selectedNoteId={selectedNoteId}
          setSelectedNoteId={setSelectedNoteId}
          updateNote={updateNote}
          setEditingNote={setEditingNote}
          setTextAreaValue={setTextAreaValue}
          setTextAreaStyle={setTextAreaStyle}
          stageRef={stageRef}
          editingNote={editingNote}
        />

        <DrawingLayer lines={lines} />
      </Stage>

      <TextEditor
        editingNote={editingNote}
        textAreaValue={textAreaValue}
        setTextAreaValue={setTextAreaValue}
        textAreaStyle={textAreaStyle}
        handleTextAreaBlur={handleTextAreaBlur}
      />

      {tool === "eraser" && <CustomCursor pos={cursorPos} size={eraserSize} />}
    </div>
  );
};

export default Whiteboard;
