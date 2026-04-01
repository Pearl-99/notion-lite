import useImageResize from "../../hooks/useImageResize";

export default function BlockRenderer({
  block,
  onChange,
  onKeyDown,
  blockRef,
  isActive,
  setActiveBlockId
}) 

{
      const wrapperStyle = `group flex items-start gap-3 px-3 py-3 rounded-lg transition-all duration-150 ${
        isActive
          ? "bg-gray-100 dark:bg-gray-900 ring-1 ring-gray-200"
          : "hover:bg-gray-100 dark:hover:bg-gray-800"
      }`;

      const inputStyle ="w-full bg-transparent outline-none";

      const { handleResize } = useImageResize(block, onChange);
    

  switch (block.type) 
  {
    case "heading":
      return (
        <div className={wrapperStyle}>
          <input
            ref={blockRef}
            value={block.content}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={onKeyDown}
            className={`text-2xl font-bold ${inputStyle}`}
            onFocus={() => setActiveBlockId(block.id)}
          />
        </div>
      );

    case "image":
      return (
        <div className="px-3 py-3">
          {!block.url ? (
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (!file) 
                  return;

                const reader = new FileReader();
                reader.onload = () => {
                  onChange({
                    ...block,
                    url: reader.result,
                  });
                };
                reader.readAsDataURL(file);
              }}
            />
          ) 
          : (
            <div className="relative inline-block">
              <img
                src={block.url}
                style={{ width: block.width || 300,
                  height: block.height || 200,
                  objectFit: "cover",
                }}
                className="rounded-lg"
              />

                  <div
                    onMouseDown={(e) => handleResize(e,"width")}
                    className="absolute right-0 top-0 h-full w-2 cursor-ew-resize"
                  />

                  <div
                    onMouseDown={(e) => handleResize(e,"height")}
                    className="absolute bottom-0 left-0 w-full h-2 cursor-ns-resize"
                  />

                  <div
                    onMouseDown={(e) => handleResize(e,"both")}
                    className="absolute right-0 bottom-0 w-3 h-3 cursor-nwse-resize"
                  />
            </div>
          )}
        </div>
      );

    case "todo":
      return (
        <div className={wrapperStyle}>
          <input type="checkbox" className="mt-1 w-4 h-4 accent-black cursor-pointer" />
          <input
            ref={blockRef}
            value={block.content}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={onKeyDown}
            className={`flex-1 ${inputStyle}`}
            onFocus={() => setActiveBlockId(block.id)}
          />
        </div>
      );

    case "divider":
      return (
        <div className="px-2 py-2">
          <hr className="border-gray-300" />
        </div>
      );

    default:
      return (
        <div className={wrapperStyle}>
          <input
            placeholder="Type '/' for commands..."
            ref={blockRef}
            value={block.content}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={onKeyDown}
            className={inputStyle}
            onFocus={() => setActiveBlockId(block.id)}
          />
        </div>
      );
  }
}