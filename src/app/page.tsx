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

    // URLパラメータから色を初期化
    const params = new URLSearchParams(window.location.search);
    const left = params.get("left");
    const center = params.get("center");
    const right = params.get("right");
    if (left) setLeftColor("#" + left);
    if (center) setCenterColor("#" + center);
    if (right) setRightColor("#" + right);

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

        <div className="mb-8 relative flex flex-col items-center">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gray-100 px-3 text-lg font-bold z-10 border border-gray-300 rounded-full">
            カラーピッカー
          </div>
          <div className="w-full border border-gray-300 rounded-lg pt-6 pb-4 px-2 flex flex-row gap-8 items-start justify-center bg-gray-100">
            <div className="flex-1 flex flex-col items-center">
              <h2 className="text-xl font-semibold mb-4">左</h2>
              <ColorPicker value={leftColor} onChange={setLeftColor} />
            </div>
            <div className="flex-1 flex flex-col items-center">
              <h2 className="text-xl font-semibold mb-4">中央</h2>
              <ColorPicker value={centerColor} onChange={setCenterColor} />
            </div>
            <div className="flex-1 flex flex-col items-center">
              <h2 className="text-xl font-semibold mb-4">右</h2>
              <ColorPicker value={rightColor} onChange={setRightColor} />
            </div>
          </div>
        </div>

        <div className="mb-4 relative flex flex-col items-center">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gray-100 px-3 text-lg font-bold z-10 border border-gray-300 rounded-full">
            ランダム
          </div>
          <div className="w-full border border-gray-300 rounded-lg pt-6 pb-4 px-2 flex flex-row flex-wrap gap-2 justify-center bg-gray-100">
            <button
              className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition-colors"
              style={{ textShadow: "0 1px 4px rgba(0,0,0,0.7)" }}
              onClick={handleRandomAll}
            >
              すべて
            </button>
            <button
              style={{
                backgroundColor: leftColor,
                color: "#fff",
                textShadow: "0 1px 4px rgba(0,0,0,0.7)",
              }}
              className="px-4 py-2 rounded hover:opacity-80 transition-colors"
              onClick={handleRandomLeft}
            >
              左
            </button>
            <button
              style={{
                backgroundColor: centerColor,
                color: "#fff",
                textShadow: "0 1px 4px rgba(0,0,0,0.7)",
              }}
              className="px-4 py-2 rounded hover:opacity-80 transition-colors"
              onClick={handleRandomCenter}
            >
              中央
            </button>
            <button
              style={{
                backgroundColor: rightColor,
                color: "#fff",
                textShadow: "0 1px 4px rgba(0,0,0,0.7)",
              }}
              className="px-4 py-2 rounded hover:opacity-80 transition-colors"
              onClick={handleRandomRight}
            >
              右
            </button>
          </div>
        </div>

        <div className="mb-8">
          <LiveColorPreview
            leftColor={leftColor}
            rightColor={rightColor}
            centerColor={centerColor}
            height={isMobile ? "16rem" : "40rem"}
            centerSquareSize={isMobile ? "5rem" : "10rem"}
          />
        </div>

        <div className="mb-8">
          <button
            className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            onClick={handleSave}
          >
            保存
          </button>
          <button
            className="w-full mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
            onClick={() => {
              const url = new URL(window.location.href);
              url.searchParams.set("left", leftColor.replace("#", ""));
              url.searchParams.set("center", centerColor.replace("#", ""));
              url.searchParams.set("right", rightColor.replace("#", ""));
              navigator.clipboard.writeText(url.toString());
              alert("シェア用URLをクリップボードにコピーしました！");
            }}
          >
            シェア
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
