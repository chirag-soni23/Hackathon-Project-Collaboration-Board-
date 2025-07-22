
const TextEditor = ({
  editingNote,
  textAreaValue,
  setTextAreaValue,
  textAreaStyle,
  handleTextAreaBlur,
}) => {
  if (!editingNote) return null;

  return (
    <textarea
      value={textAreaValue}
      onChange={(e) => setTextAreaValue(e.target.value)}
      onBlur={handleTextAreaBlur}
      autoFocus
      className="outline-none border-none resize-none text-[16px] leading-snug font-medium shadow-lg"
      style={textAreaStyle}
    />
  );
};

export default TextEditor;
