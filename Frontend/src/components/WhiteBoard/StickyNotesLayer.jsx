import { Layer, Group, Rect, Text } from "react-konva";

const StickyNotesLayer = ({
  notes,
  tool,
  selectedNoteId,
  setSelectedNoteId,
  updateNote,
  setEditingNote,
  setTextAreaValue,
  setTextAreaStyle,
  stageRef,
  editingNote,
}) => {
  return (
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
            setSelectedNoteId((prev) => (prev === note._id ? null : note._id))
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
  );
};

export default StickyNotesLayer;
