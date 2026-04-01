import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faFile, faHome } from "@fortawesome/free-solid-svg-icons";


export default function Sidebar({
  pages,
  setPages,
  currentPageId,
  setCurrentPageId,
  setBlocks,
  isSidebarOpen,
}) 

{
  const [editingPageId, setEditingPageId] = useState(null);

  function handleAddPage() 
  {
    const pageId = Date.now().toString();
    const blockId = Date.now().toString();

    const newBlock = 
    {
      id: blockId,
      type: "text",
      content: "",
    };

    setBlocks((prev) => ({
      ...prev,
      [blockId]: newBlock,
    }));

    setPages((prev) => ({
      ...prev,
      [pageId]: {
        id: pageId,
        title: "Untitled",
        blocks: [blockId],
      },
    }));

    setCurrentPageId(pageId);
  }

  function handleDeletePage(pageId) 
  {
    if (Object.keys(pages).length === 1) 
      return;

    const page = pages[pageId];

    const remainingIds = Object.keys(pages).filter(
      (id) => id !== pageId
    );

    if (currentPageId === pageId) 
    {
      setCurrentPageId(remainingIds[0]);
    }

    setBlocks((prevBlocks) => {
      const updated = { ...prevBlocks };
      page.blocks.forEach((id) => delete updated[id]);
      return updated;
    });

    setPages((prevPages) => {
      const updated = { ...prevPages };
      delete updated[pageId];
      return updated;
    });
  }

  function handleReset() 
  {
    localStorage.removeItem("notion-data");
    window.location.reload();
  }

  function renderPages() 
  {
    return Object.values(pages).map((page) => 
      {
      const isActive = currentPageId === page.id;
      const isEditing = editingPageId === page.id;
      const icon = page.title === "Home" ? faHome : faFile;

      return (
        <div
          key={page.id}
          title={!isSidebarOpen ? page.title : ""}
          className={`group flex items-center flex-1 min-w-0 px-3 py-2 rounded-lg cursor-pointer transition-all duration-150 ${
          isSidebarOpen ? "justify-between" : "justify-center"
        } ${
          isActive
            ? "bg-gray-200 dark:bg-gray-800 font-medium border-l-4 border-black dark:border-white "
            : "hover:bg-gray-200 dark:hover:bg-gray-700"
        }`}

          onClick={() => setCurrentPageId(page.id)}
          onDoubleClick={() => {
            if (page.title === "Home") 
              return;
            setEditingPageId(page.id);
            }}
        >
          <div className="flex items-center gap-2">
         
          <FontAwesomeIcon
              icon={icon}
              className="text-gray-500 dark:text-white text-sm"
          />

            {isSidebarOpen && (
              <>
                {isEditing && page.title !== "Home" ? 
                (
                  <input
                    value={page.title}
                    autoFocus
                    onChange={(e) => {
                      const value = e.target.value;

                      setPages((prev) => ({
                        ...prev,
                        [page.id]: {
                          ...prev[page.id],
                          title: value,
                        },
                      }));
                    }}
                    onBlur={() => setEditingPageId(null)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") 
                        setEditingPageId(null);
                    }}
                    
                    className="bg-transparent outline-none w-full truncate text-gray-800 dark:text-white"
                  />
                ) : 
                (
                  <span className="text-sm text-black dark:text-white
                  group-hover:text-gray-800 group-hover:dark:text-purple-400 transition">
                  {page.title}
                </span>
                )}
              </>
            )}
          </div>

          {isSidebarOpen && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (page.title === "Home") 
                  return;
                handleDeletePage(page.id);
              }}
              disabled={page.title === "Home"}
              className={` group-hover:opacity-100 transition ${
                page.title === "Home"
                  ? "text-gray-300 cursor-not-allowed dark:text-gray-500"
                  : "text-gray-400 dark:text-white  hover:text-red-500 hover:dark:dark:text-red-500 flex-shrink-0"
              }`}
            >
              <FontAwesomeIcon icon={faTrash} />
            </button>
          )}
        </div>
      );
      });
  }


  return (
    <div
      className={`h-screen pt-12 bg-gray-100 dark:bg-[#202020] border-r border-gray-200 dark:border-gray-700 flex flex-col transition-all duration-300 ease-in-out ${
        isSidebarOpen ? "w-64" : "w-16"
      }`}
    >
      {/* HEADER */}
      <div className="p-3">
        {isSidebarOpen && (
          <h2 className="text-4xl font-semibold my-4 dark:text-white">Workspace</h2>
        )}
      </div>

      {/* PAGES */}
      <div className="flex-1 overflow-y-auto px-2 space-y-1">
        {renderPages()}
      </div>

      {/* ACTIONS */}
      {isSidebarOpen && (
        <div className="p-3 space-y-1 mt-auto mb-4">
          <button
            onClick={handleAddPage}
            className="w-full bg-black text-white dark:bg-gray-600 dark:hover:bg-gray-500 rounded-xl py-2 text-sm transition duration-200 ease-in-out transform hover:scale-105 shadow-sm"
          >
            + New Page
          </button>

          <button
            onClick={handleReset}
            className="w-full bg-red-500 dark:bg-red-700 hover:bg-red-600 text-white rounded-xl py-2 text-sm transition duration-200 ease-in-out transform hover:scale-105 shadow-sm"
          >
            Reset Workspace
          </button>
        </div>
      )}
    </div>
  );
}