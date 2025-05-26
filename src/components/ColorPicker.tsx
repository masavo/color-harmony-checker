import { useState, useEffect, useRef } from "react";
import { HexColorPicker } from "react-colorful";
import { ColorPickerStrategy } from "@/types/color";
import { RefreshCw } from "lucide-react";

function isHexColor(str: string) {
  return /^#([0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(str);
}

function isRgbaColor(str: string) {
  return /^rgba?\((\s*\d+\s*,){2,3}\s*(\d+(\.\d+)?|\d+%)\s*\)$/.test(str);
}

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  strategy?: ColorPickerStrategy; // 省略可
  label?: string;
  onRandomClick?: () => void; // 追加
}

export function ColorPicker({
  value,
  onChange,
  label,
  onRandomClick,
}: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState(value);
  const pickerRef = useRef<HTMLDivElement>(null);

  // 外側クリックで閉じる
  useEffect(() => {
    if (!isOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isOpen]);

  // HEX or RGBA
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    if (isHexColor(e.target.value) || isRgbaColor(e.target.value)) {
      onChange(e.target.value);
    }
  };

  // パネルの位置をlabelで切り替え
  let panelClass =
    "absolute z-20 bg-white rounded-lg shadow-lg p-4 min-w-[220px]";
  if (label === "右") {
    panelClass += " mt-0 right-full top-1/2 -translate-y-1/2 mr-2";
  } else if (label === "中央") {
    panelClass += " left-1/2 -translate-x-1/2 mt-2 top-full";
  } else {
    // 左
    panelClass += " mt-0 left-full top-1/2 -translate-y-1/2 ml-2";
  }

  return (
    <div className="relative inline-block" ref={pickerRef}>
      <div className="flex items-center gap-1">
        <button
          type="button"
          className="w-12 h-12 rounded border border-gray-300 flex items-center justify-center text-white font-bold text-lg select-none"
          style={{
            backgroundColor: value,
            textShadow: "0 0 2px #000, 0 0 2px #000, 0 0 2px #000",
          }}
          onClick={() => setIsOpen((v) => !v)}
          aria-label="カラーピッカーを開く"
        >
          {label}
        </button>
        {onRandomClick && (
          <button
            type="button"
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 text-gray-500 hover:bg-gray-300 hover:text-gray-700 border border-gray-300 shadow-sm"
            aria-label="ランダム色にする"
            onClick={onRandomClick}
            tabIndex={-1}
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        )}
      </div>
      {isOpen && (
        <div className={panelClass}>
          <HexColorPicker
            color={value}
            onChange={(c) => {
              onChange(c);
              setInput(c);
            }}
          />
          <input
            className="mt-2 w-full border rounded px-2 py-1 text-sm"
            value={input}
            onChange={handleInputChange}
            placeholder="#RRGGBB または rgba(…)"
            spellCheck={false}
          />
          <div className="flex justify-end mt-2">
            <button
              className="px-3 py-1 text-xs bg-gray-200 rounded hover:bg-gray-300"
              onClick={() => setIsOpen(false)}
            >
              閉じる
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
