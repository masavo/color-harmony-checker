interface LiveColorPreviewProps {
  leftColor: string;
  rightColor: string;
  centerColor: string;
  height?: string; // 例: '12rem' など
  centerSquareSize?: string; // 追加
}

export function LiveColorPreview({
  leftColor,
  rightColor,
  centerColor,
  height = "40rem",
  centerSquareSize = "10rem", // 追加
}: LiveColorPreviewProps) {
  return (
    <div className="relative w-full flex" style={{ height }}>
      {/* 左側 */}
      <div
        style={{
          width: "50%",
          height: "100%",
          backgroundColor: leftColor,
          position: "relative",
        }}
      >
        {/* 左側の中央四角 */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: centerSquareSize,
            height: centerSquareSize,
            backgroundColor: centerColor,
            transform: "translate(-50%, -50%)",
            borderRadius: "0.25rem",
          }}
        />
      </div>
      {/* 右側 */}
      <div
        style={{
          width: "50%",
          height: "100%",
          backgroundColor: rightColor,
          position: "relative",
        }}
      >
        {/* 右側の中央四角 */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: centerSquareSize,
            height: centerSquareSize,
            backgroundColor: centerColor,
            transform: "translate(-50%, -50%)",
            borderRadius: "0.25rem",
          }}
        />
      </div>
    </div>
  );
}
