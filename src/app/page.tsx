"use client";

import { useState, useEffect } from "react";
import { ColorCombination } from "@/types/color";
import { LocalStorageColorStorage } from "@/lib/storage";
import { ColorPicker } from "@/components/ColorPicker";
import { ColorCombinationGrid } from "@/components/ColorCombinationGrid";
import { LiveColorPreview } from "@/components/LiveColorPreview";

const storage = new LocalStorageColorStorage();

function randomColor() {
  // #RRGGBB形式で返す
  return (
    "#" +
    Math.floor(Math.random() * 0xffffff)
      .toString(16)
      .padStart(6, "0")
  );
}

export default function Home() {
  const [leftColor, setLeftColor] = useState(randomColor());
  const [rightColor, setRightColor] = useState(randomColor());
  const [centerColor, setCenterColor] = useState(randomColor());
  const [savedCombinations, setSavedCombinations] = useState<
    ColorCombination[]
  >([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const loadSavedCombinations = async () => {
      const combinations = await storage.list();
      setSavedCombinations(combinations);
    };

    const handleResize = () => {
      setIsMobile(window.innerWidth < 428);
    };

    loadSavedCombinations();
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ランダムボタン
  const handleRandomAll = () => {
    setLeftColor(randomColor());
    setRightColor(randomColor());
    setCenterColor(randomColor());
  };
  const handleRandomLeft = () => setLeftColor(randomColor());
  const handleRandomRight = () => setRightColor(randomColor());
  const handleRandomCenter = () => setCenterColor(randomColor());

  const handleSave = async () => {
    const name = prompt(
      "保存する名前を入力してください（未入力の場合は中央の色のカラーコードが使用されます）"
    );
    const combination = await storage.save({
      name: name || centerColor,
      leftBackgroundColor: leftColor,
      rightBackgroundColor: rightColor,
      centerSquareColor: centerColor,
    });
    setSavedCombinations([...savedCombinations, combination]);
  };

  const handleDelete = async (id: string) => {
    await storage.delete(id);
    setSavedCombinations(savedCombinations.filter((c) => c.id !== id));
  };

  const handleNameChange = async (id: string, newName: string) => {
    const updated = await storage.update(id, { name: newName });
    setSavedCombinations(
      savedCombinations.map((c) => (c.id === id ? updated : c))
    );
  };

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">
          背景色チェッカー
        </h1>

        <div className="mb-4 flex flex-wrap gap-2 justify-center">
          <button
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
            onClick={handleRandomAll}
          >
            すべてランダム
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            onClick={handleRandomLeft}
          >
            左だけランダム
          </button>
          <button
            className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600 transition-colors"
            onClick={handleRandomRight}
          >
            右だけランダム
          </button>
          <button
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
            onClick={handleRandomCenter}
          >
            真ん中だけランダム
          </button>
        </div>

        <div
          className={`flex ${
            isMobile ? "flex-col" : "flex-row"
          } gap-8 mb-8 items-start justify-center`}
        >
          <div className="flex-1 flex flex-col items-center">
            <h2 className="text-xl font-semibold mb-4">左側の色</h2>
            <ColorPicker value={leftColor} onChange={setLeftColor} />
          </div>
          <div className="flex-1 flex flex-col items-center">
            <h2 className="text-xl font-semibold mb-4">中央の色</h2>
            <ColorPicker value={centerColor} onChange={setCenterColor} />
          </div>
          <div className="flex-1 flex flex-col items-center">
            <h2 className="text-xl font-semibold mb-4">右側の色</h2>
            <ColorPicker value={rightColor} onChange={setRightColor} />
          </div>
        </div>

        <div className="mb-8">
          <LiveColorPreview
            leftColor={leftColor}
            rightColor={rightColor}
            centerColor={centerColor}
            height={isMobile ? "8rem" : "40rem"}
          />
        </div>

        <div className="mb-8">
          <button
            className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            onClick={handleSave}
          >
            現在の色の組み合わせを保存
          </button>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">保存した色の組み合わせ</h2>
          <ColorCombinationGrid
            combinations={savedCombinations}
            onDelete={handleDelete}
            onNameChange={handleNameChange}
          />
        </div>
      </div>
    </main>
  );
}
