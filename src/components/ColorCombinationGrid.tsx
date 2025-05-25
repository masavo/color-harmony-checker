import { useState } from "react";
import { ColorCombination } from "@/types/color";
import { ColorCombinationPreview } from "./ColorCombinationPreview";

interface ColorCombinationGridProps {
  combinations: ColorCombination[];
  onDelete: (id: string) => void;
  onNameChange: (id: string, newName: string) => void;
  onSelect?: (combination: ColorCombination) => void;
}

export function ColorCombinationGrid({
  combinations,
  onDelete,
  onNameChange,
  onSelect,
}: ColorCombinationGridProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedName, setEditedName] = useState("");

  const handleNameEdit = (combination: ColorCombination) => {
    setEditingId(combination.id);
    setEditedName(combination.name);
  };

  const handleNameSubmit = (id: string) => {
    if (editedName.trim()) {
      onNameChange(id, editedName.trim());
      setEditingId(null);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {combinations.map((combination) => (
        <div
          key={combination.id}
          className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow flex flex-row items-center gap-4"
        >
          <div className="flex-1 flex flex-col justify-center gap-2">
            {editingId === combination.id ? (
              <input
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                onBlur={() => handleNameSubmit(combination.id)}
                onKeyPress={(e) =>
                  e.key === "Enter" && handleNameSubmit(combination.id)
                }
                className="w-full px-2 py-1 border rounded"
                autoFocus
              />
            ) : (
              <h3
                className="text-lg font-medium cursor-pointer hover:bg-gray-100 rounded px-2 py-1 text-left"
                onClick={() => handleNameEdit(combination)}
              >
                {combination.name}
              </h3>
            )}
            <p className="text-sm text-gray-500 mt-1 text-left">
              {combination.centerSquareColor}
            </p>
            <p className="text-xs text-gray-400 mt-1 text-left">
              {new Date(combination.createdAt).toLocaleDateString()}
            </p>
            <div className="mt-2 flex gap-2">
              <button
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                onClick={() => {
                  if (window.confirm("この色の組み合わせを削除しますか？")) {
                    onDelete(combination.id);
                  }
                }}
              >
                削除
              </button>
              <button
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                onClick={() => {
                  const url = new URL(window.location.origin);
                  url.searchParams.set(
                    "left",
                    combination.leftBackgroundColor.replace("#", "")
                  );
                  url.searchParams.set(
                    "center",
                    combination.centerSquareColor.replace("#", "")
                  );
                  url.searchParams.set(
                    "right",
                    combination.rightBackgroundColor.replace("#", "")
                  );
                  if (combination.name)
                    url.searchParams.set("title", combination.name);
                  navigator.clipboard.writeText(url.toString());
                  alert("シェア用URLをクリップボードにコピーしました！");
                }}
              >
                シェア
              </button>
            </div>
          </div>
          <div className="flex-shrink-0">
            <div
              className={onSelect ? "cursor-pointer" : undefined}
              onClick={() => onSelect && onSelect(combination)}
            >
              <ColorCombinationPreview combination={combination} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
