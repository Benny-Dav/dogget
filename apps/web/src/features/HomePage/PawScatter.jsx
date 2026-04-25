import React, { useMemo } from "react";

const PAW_SRC = "https://res.cloudinary.com/dfb2hl46r/image/upload/v1751533480/icons8-paw-print-30_but1ue.png";

function getRandom(min, max) {
  return Math.random() * (max - min) + min;
}

function isOverlapping(newPaw, placedPaws, minDistance) {
  return placedPaws.some(
    (paw) =>
      Math.hypot(newPaw.left - paw.left, newPaw.top - paw.top) <
      (newPaw.size + paw.size) / 2 + minDistance
  );
}

const PawScatter = ({
  pawCount = 12,
  width = 700,
  height = 400,
  pawMinSize = 32,
  pawMaxSize = 44,
  minDistance = 32, // minimum distance between paw centers
  className = "",
  style = {},
}) => {
  const paws = useMemo(() => {
    const arr = [];
    let attempts = 0;
    const maxAttempts = pawCount * 20;
    while (arr.length < pawCount && attempts < maxAttempts) {
      const size = getRandom(pawMinSize, pawMaxSize);
      const left = getRandom(0, width - size);
      const top = getRandom(0, height - size);
      const rotate = getRandom(-45, 45);
      const opacity = getRandom(0.5, 1);
      const newPaw = { left, top, rotate, opacity, size };
      if (
        !isOverlapping(
          { ...newPaw, left: left + size / 2, top: top + size / 2 },
          arr,
          minDistance
        )
      ) {
        arr.push(newPaw);
      }
      attempts++;
    }
    return arr;
  }, [pawCount, width, height, pawMinSize, pawMaxSize, minDistance]);

  return (
    <div
      className={`relative pointer-events-none z-0 mt-[10%] ${className}`}
      style={{ width, height, ...style }}
      aria-hidden="true"
    >
      {paws.map((paw, i) => (
        <img
          key={i}
          src={PAW_SRC}
          alt=""
          style={{
            position: "absolute",
            left: paw.left,
            top: paw.top,
            width: paw.size,
            height: paw.size,
            transform: `rotate(${paw.rotate}deg)`,
            opacity: paw.opacity,
            pointerEvents: "none",
            userSelect: "none",
          }}
          draggable={false}
        />
      ))}
    </div>
  );
};

export default PawScatter;