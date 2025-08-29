import { NodeProps } from "reactflow";
import { EvaData } from "../../types/evaData";
import DivisionSignIcon from "../../assets/icons/division-sign.svg";

type LineNodeData = {
  width?: number;
  height?: number;
  color?: string;
};

export const ParallelogramNode = ({ data }: NodeProps<EvaData>) => {
  return (
    <div
      style={{
        background: "#ffffffff",
        border: "2px solid #333",
        fontWeight: "bold",
        display: "inline-block",
        padding: "0",
        transform: "skew(-20deg)",
        minWidth: "150px",
      }}
    >
      <div style={{ padding: "10px 20px" }}>{data.label}</div>
    </div>
  );
};

export const TitleNode = ({ data }: NodeProps<EvaData>) => {
  return (
    <div
      style={{
        padding: "10px",
        backgroundColor: "transparent",
        fontWeight: 700,
        minWidth: "220px",
        textAlign: "center" as const,
        fontSize: "24px",
        color: "#DC3545",
        transform: `rotate(${-90}deg)`,
      }}
    >
      <div style={{ padding: "10px 20px" }}>{data.label}</div>
    </div>
  );
};

export const IconNode = () => {
  return (
    <div
      style={{
        padding: "10px",
        backgroundColor: "transparent",
        minWidth: "220px",
      }}
    >
      <img src={DivisionSignIcon} style={{ width: "64px" }} />
    </div>
  );
};

export const ParallelogramNodeTitle = ({ data }: NodeProps<EvaData>) => {
  return (
    <div
      style={{
        width: "270px",
        background: "#3270c1ff",
        color: "white",
        border: "2px solid #333",
        fontWeight: "bold",
        display: "inline-block",
        padding: "0",
        transform: "skew(-20deg)",
      }}
    >
      <div style={{ padding: "10px 20px" }}>{data.label}</div>
    </div>
  );
};

export const Linker = () => {
  return (
    <div
      style={{
        padding: "10px",
        minWidth: "220px",
      }}
    >
      <img src={DivisionSignIcon} />
    </div>
  );
};

export const LineNode = ({ data }: NodeProps<LineNodeData>) => {
  const { width = 2, height = 100, color = "#333" } = data;

  return (
    <div
      style={{
        width: `${width}px`,
        height: `${height}px`,
        backgroundColor: color,
        borderRadius: "2px",
      }}
    />
  );
};
