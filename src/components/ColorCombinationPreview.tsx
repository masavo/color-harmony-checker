import { ColorCombination } from "@/types/color";

interface ColorCombinationPreviewProps {
  combination: ColorCombination;
  size?: number;
}

export function ColorCombinationPreview({
  combination,
  size = 6,
}: ColorCombinationPreviewProps) {
  const remSize = `${size}rem`;
  const halfSize = `${size / 2}rem`;
  const squareSize = `3rem`;

  return (
    <div className="relative flex" style={{ width: remSize, height: remSize }}>
      {/* 左側 */}
      <div
        style={{
          width: halfSize,
          height: remSize,
          backgroundColor: combination.leftBackgroundColor,
        }}
      />
      {/* 右側 */}
      <div
        style={{
          width: halfSize,
          height: remSize,
          backgroundColor: combination.rightBackgroundColor,
        }}
      />
      {/* 中央の四角 */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: squareSize,
          height: squareSize,
          backgroundColor: combination.centerSquareColor,
          transform: "translate(-50%, -50%)",
          borderRadius: "0.25rem",
          border: "2px solid #fff",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        }}
      />
    </div>
  );
}
