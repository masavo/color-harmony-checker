import { useState } from "react";
import { HexColorPicker } from "react-colorful";
import { ColorPickerStrategy } from "@/types/color";

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
}

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState(value);

  // HEX or RGBA
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    if (isHexColor(e.target.value) || isRgbaColor(e.target.value)) {
      onChange(e.target.value);
    }
  };

  return (
    <div className="relative inline-block">
      <button
        type="button"
        className="w-12 h-12 rounded border border-gray-300"
        style={{ backgroundColor: value }}
        onClick={() => setIsOpen((v) => !v)}
        aria-label="カラーピッカーを開く"
      />
      {isOpen && (
        <div className="absolute z-20 mt-2 left-0 bg-white rounded-lg shadow-lg p-4 min-w-[220px]">
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
