import { Layer, Line } from "react-konva";

const DrawingLayer = ({ lines }) => (
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
);

export default DrawingLayer;
