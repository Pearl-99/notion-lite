import { useCallback } from "react";

export default function useImageResize(block, onChange) 
{
  const handleResize = useCallback(
    (e, direction) => {
      e.preventDefault();

      const startX = e.clientX;
      const startY = e.clientY;

      const startWidth = block.width || 300;
      const startHeight = block.height || 200;

      const aspectRatio = startWidth / startHeight;

      function onMouseMove(moveEvent) 
      {
        let newWidth = startWidth;
        let newHeight = startHeight;

        if (direction === "width" || direction === "both") 
        {
          newWidth = startWidth + (moveEvent.clientX - startX);
        }

        if (direction === "height" || direction === "both") 
        {
          newHeight = startHeight + (moveEvent.clientY - startY);
        }

        if (moveEvent.shiftKey && direction === "both") 
        {
          newHeight = newWidth / aspectRatio;
        }

        onChange({
          ...block,
          width: Math.max(100, newWidth),
          height: Math.max(100, newHeight),
        });
      }

      function onMouseUp() 
      {
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
      }

      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    },
    [block, onChange]
  );

  return { handleResize };
}