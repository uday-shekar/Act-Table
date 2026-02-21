import { useState } from "react";

interface Props {
  totalRows: number;
  onApply: (count: number) => void;
  onClose: () => void;
}

const RowSelectionOverlay = ({ totalRows, onApply, onClose }: Props) => {
  const [value, setValue] = useState("");

  const handleApply = () => {
    const n = Math.min(Number(value), totalRows);
    if (!isNaN(n) && n > 0) {
      onApply(n);
      onClose();
    }
  };

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        position: "absolute",
        top: "100%",
        left: "100%",          // 👉 right side
        marginLeft: 8,
        background: "#fff",
        border: "1px solid #dcdcdc",
        borderRadius: 6,
        padding: 12,
        width: 260,
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        zIndex: 1000,
      }}
    >
      <div style={{ fontWeight: 600, marginBottom: 6 }}>
        Select Multiple Rows
      </div>

      <div style={{ fontSize: 12, color: "#666", marginBottom: 8 }}>
        Enter number of rows to select
      </div>

      <input
        type="number"
        placeholder={`e.g. 20 (max ${totalRows})`}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        style={{
          width: "100%",
          padding: 6,
          border: "1px solid #ccc",
          borderRadius: 4,
          marginBottom: 8,
        }}
      />

      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
        <button
          onClick={onClose}
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            color: "#555",
          }}
        >
          Cancel
        </button>

        <button
          onClick={handleApply}
          style={{
            background: "#1976d2",
            color: "#fff",
            border: "none",
            padding: "6px 12px",
            borderRadius: 4,
            cursor: "pointer",
            fontWeight: 500,
          }}
        >
          Select
        </button>
      </div>
    </div>
  );
};

export default RowSelectionOverlay;