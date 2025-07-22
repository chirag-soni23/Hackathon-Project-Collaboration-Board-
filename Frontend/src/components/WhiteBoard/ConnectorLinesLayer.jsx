import { Layer, Line } from "react-konva";

const ConnectorLinesLayer = ({ notesByUser }) => {
  const lines = [];

  Object.entries(notesByUser).forEach(([name, userNotes]) => {
    if (userNotes.length < 2) return;

    const sorted = [...userNotes].sort((a, b) => a.x - b.x);

    for (let i = 0; i < sorted.length - 1; i++) {
      const from = sorted[i];
      const to = sorted[i + 1];

      lines.push(
        <Line
          key={`${from._id}-${to._id}`}
          points={[from.x + 100, from.y + 110, to.x + 100, to.y + 110]}
          stroke="white"
          strokeWidth={2}
          lineCap="round"
        />
      );
    }
  });

  return <Layer>{lines}</Layer>;
};

export default ConnectorLinesLayer;
