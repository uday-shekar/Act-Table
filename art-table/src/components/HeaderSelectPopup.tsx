import { useState, RefObject } from "react";

interface Props {
  anchorRef: RefObject<HTMLDivElement | null>;
  onSelect: (count: number) => void;
  onClose: () => void;
}

const HeaderSelectPopup = ({ anchorRef, onSelect, onClose }: Props) => {
  const [value, setValue] = useState("");

  const rect = anchorRef.current?.getBoundingClientRect();
  if (!rect) return null;

  const handleSelect = () => {
    const n = Number(value);
    if (!isNaN(n) && n > 0) {
      onSelect(n);
      onClose();
    }
  };

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        position: "fixed",
        top: rect.bottom + 6,
        left: rect.left,
        width: 260,
        padding: 12,
        background: "#fff",
        borderRadius: 8,
        border: "1px solid #ddd",
        boxShadow: "0 6px 18px rgba(0,0,0,0.15)",
        zIndex: 1000,
      }}
    >
      <div style={{ fontWeight: 600, marginBottom: 6 }}>
        Select Multiple Rows
      </div>

      <input
        type="number"
        placeholder="e.g. 20"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        style={{
          width: "100%",
          padding: 6,
          borderRadius: 4,
          border: "1px solid #ccc",
          marginBottom: 10,
        }}
      />

      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
        <button onClick={onClose}>Cancel</button>
        <button
          onClick={handleSelect}
          style={{
            background: "#1976d2",
            color: "#fff",
            border: "none",
            padding: "6px 12px",
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          Select
        </button>
      </div>
    </div>
  );
};

export default HeaderSelectPopup;