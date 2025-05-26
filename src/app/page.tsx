"use client";

import { useState, useEffect, useRef } from "react";
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
  const [title, setTitle] = useState("");
  const [showHelp, setShowHelp] = useState(false);
  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadSavedCombinations = async () => {
      const combinations = await storage.list();
      setSavedCombinations(combinations);
    };

    // URLパラメータから色とタイトルを初期化
    const params = new URLSearchParams(window.location.search);
    const left = params.get("left");
    const center = params.get("center");
    const right = params.get("right");
    const titleParam = params.get("title");
    if (left) setLeftColor("#" + left);
    if (center) setCenterColor("#" + center);
    if (right) setRightColor("#" + right);
    if (titleParam) setTitle(titleParam);

    loadSavedCombinations();
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
    let saveTitle = title;
    if (!saveTitle) {
      saveTitle =
        prompt(
          "保存する名前を入力してください（未入力の場合は中央の色のカラーコードが使用されます）"
        ) || "";
    }
    const combination = await storage.save({
      name: saveTitle || centerColor,
      leftBackgroundColor: leftColor,
      rightBackgroundColor: rightColor,
      centerSquareColor: centerColor,
    });
    setSavedCombinations([...savedCombinations, combination]);
    if (!title && saveTitle) setTitle(saveTitle);
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
        <div className="flex justify-center items-center gap-2 relative">
          <h1 className="text-[clamp(1.2rem,6vw,2.5rem)] font-extrabold italic mb-[0.3rem] bg-gradient-to-r from-purple-600 via-blue-500 via-green-500 via-green-400 via-yellow-300 via-yellow-400 via-orange-400 to-red-500 bg-clip-text text-transparent inline-block pl-8 whitespace-nowrap max-w-full overflow-hidden text-ellipsis">
            色の相対性チェッカー
          </h1>
          <button
            className="ml-2 w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 text-gray-500 hover:bg-gray-300 hover:text-gray-700 text-xl font-bold focus:outline-none border border-gray-300 shadow-sm"
            aria-label="説明を表示"
            onClick={() => setShowHelp((v) => !v)}
            style={{ lineHeight: 1 }}
          >
            ？
          </button>
          {showHelp && (
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[320px] bg-white border border-gray-300 rounded-lg shadow-lg p-4 z-20 text-sm text-gray-700">
              背景色の組み合わせによって、真ん中の色の見え方が変わる視覚効果を体験できるアプリです。
              <br />
              色の組み合わせを保存・シェアして、色の相対性を楽しんでください。
              <div className="text-right mt-2">
                <button
                  className="text-blue-500 hover:underline text-xs"
                  onClick={() => setShowHelp(false)}
                >
                  閉じる
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="mb-3 flex justify-center">
          <input
            ref={titleInputRef}
            type="text"
            className="text-2xl font-bold text-center border-b border-gray-300 px-4 py-2 min-w-[120px] max-w-full outline-none"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="タイトルを入力"
          />
        </div>

        <div className="mb-3">
          <LiveColorPreview
            leftColor={leftColor}
            rightColor={rightColor}
            centerColor={centerColor}
            height="16rem"
            centerSquareSize="5rem"
          />
        </div>

        <div className="mb-3 mt-5 relative flex flex-col items-center">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gray-100 px-3 text-lg font-bold z-10 border border-gray-300 rounded-full">
            カラーピッカー
          </div>
          <div className="w-full border border-gray-300 rounded-lg pt-6 pb-4 px-2 flex flex-col gap-4 bg-gray-100">
            <div className="flex flex-row gap-8 items-start justify-center">
              <div className="flex-1 flex flex-col items-center">
                <ColorPicker
                  value={leftColor}
                  onChange={setLeftColor}
                  label="左"
                  onRandomClick={handleRandomLeft}
                />
              </div>
              <div className="flex-1 flex flex-col items-center">
                <ColorPicker
                  value={centerColor}
                  onChange={setCenterColor}
                  label="中央"
                  onRandomClick={handleRandomCenter}
                />
              </div>
              <div className="flex-1 flex flex-col items-center">
                <ColorPicker
                  value={rightColor}
                  onChange={setRightColor}
                  label="右"
                  onRandomClick={handleRandomRight}
                />
              </div>
            </div>
            <div className="flex justify-center">
              <button
                className="px-8 py-1.5 bg-gray-400 text-white rounded hover:bg-gray-500 transition-colors text-sm"
                style={{ textShadow: "0 1px 4px rgba(0,0,0,0.7)" }}
                onClick={handleRandomAll}
              >
                すべてランダム
              </button>
            </div>
          </div>
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
              if (title) url.searchParams.set("title", title);
              navigator.clipboard.writeText(url.toString());
              alert("シェア用URLをクリップボードにコピーしました！");
            }}
          >
            シェア
          </button>
          <button
            className="w-full mt-2 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-900 transition-colors"
            onClick={() => {
              // URLパラメータを消す
              window.history.replaceState(null, "", window.location.pathname);
              // すべて黒に
              setLeftColor("#000000");
              setCenterColor("#ffffff");
              setRightColor("#000000");
              setTitle("");
            }}
          >
            リセット
          </button>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">保存した色の組み合わせ</h2>
          <ColorCombinationGrid
            combinations={savedCombinations}
            onDelete={handleDelete}
            onNameChange={handleNameChange}
            onSelect={(comb) => {
              setLeftColor(comb.leftBackgroundColor);
              setCenterColor(comb.centerSquareColor);
              setRightColor(comb.rightBackgroundColor);
              setTitle(comb.name);
              // タイトル入力欄までスクロール
              titleInputRef.current?.scrollIntoView({ behavior: "smooth" });
            }}
          />
        </div>
      </div>
      <footer className="w-full text-center text-xs text-gray-400 py-6">
        created by{" "}
        <a
          href="https://x.com/masavo_jp"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-blue-500"
        >
          @masavo_jp
        </a>
      </footer>
    </main>
  );
}
