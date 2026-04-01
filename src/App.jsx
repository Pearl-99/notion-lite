import { useState } from "react";
import Sidebar from "./components/layout/Sidebar";
import Editor from "./components/layout/Editor";
import { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faBars,faMoon,faSun } from "@fortawesome/free-solid-svg-icons";


function App() 
{
      const defaultData = {
        pages: {
            "1": {
              id: "1",
              title: "Home",
              isLocked: true,
              blocks: ["b1","b2","b3","b4","b5","b6","b7","b8","b9","b10"],
            }
          },
        blocks: {
          "b1": {
            id: "b1",
            type: "heading",
            content: "🚀 Welcome to Your Workspace",
          },
          "b2": {
            id: "b2",
            type: "text",
            content: "This is your personal workspace where you can create and organize notes.",
          },
          "b3": {
            id: "b3",
            type: "heading",
            content: "✨ Features",
          },
          "b4": {
            id: "b4",
            type: "todo",
            content: "Create and edit pages",
          },
          "b5": {
            id: "b5",
            type: "todo",
            content: "Drag and reorder blocks",
          },
          "b6": {
            id: "b6",
            type: "todo",
            content: "Use '/' for commands",
          },
          "b7": {
            id: "b7",
            type: "todo",
            content: "Change theme",
          },
          "b8": {
            id: "b8",
            type: "heading",
            content: "⚡ How to Use",
          },
          "b9": {
            id: "b9",
            type: "text",
            content: "Create a new page by clicking '+ New Page'",
          },
          "b10": {
            id: "b10",
            type: "text",
            content: "Type '/' to open commands menu.",
          },
        },
        currentPageId: "1",
        };    
        
        
      //UseStates

      const [pages, setPages] = useState(() => {
          const saved = localStorage.getItem("notion-data");
          return saved ? JSON.parse(saved).pages : defaultData.pages;
        });

      const [blocks, setBlocks] = useState(() => {
          const saved = localStorage.getItem("notion-data");
          return saved ? JSON.parse(saved).blocks : defaultData.blocks;
        });

      const [currentPageId, setCurrentPageId] = useState(() => {
          const saved = localStorage.getItem("notion-data");
          return saved ? JSON.parse(saved).currentPageId : defaultData.currentPageId;
        });

      const [darkMode, setDarkMode] = useState(() => {
          const saved = localStorage.getItem("theme");
          return saved === "dark";
        });

      const [isSidebarOpen, setIsSidebarOpen] = useState(true);


      //UseEffects
      
      useEffect(() => {
        const data = {
          pages,
          blocks,
          currentPageId,
        };

        localStorage.setItem("notion-data", JSON.stringify(data));
        }, [pages, blocks, currentPageId]);

      useEffect(() => {
        const root = document.documentElement;

        if (darkMode) 
        {
          root.classList.add("dark");
          localStorage.setItem("theme", "dark");
        } 
        else 
        {
          root.classList.remove("dark");
          localStorage.setItem("theme", "light");
        }
      }, [darkMode]);


  return (
    <div className="flex">

      <button
        onClick={() => setIsSidebarOpen((prev) => !prev)}
        className="fixed top-4 left-4 z-50 p-1.5 rounded-md hover:bg-gray-200 hover:dark:bg-gray-800 text-gray-500 transition-colors"
      >
        <FontAwesomeIcon icon={faBars} className="text-sm" />
      </button>

      <Sidebar
        pages={pages}
        setPages={setPages}
        currentPageId={currentPageId}
        setCurrentPageId={setCurrentPageId}
        setBlocks={setBlocks}
        isSidebarOpen={isSidebarOpen}
      />

      <Editor
        pages={pages}
        currentPageId={currentPageId}
        blocks={blocks}
        setBlocks={setBlocks}
        setPages={setPages}
      />

      <button
        onClick={() => setDarkMode(prev => !prev)}
        className="fixed top-4 right-4 z-50 p-2 rounded-md 
        bg-white dark:bg-[#191919] 
        hover:bg-gray-200 dark:hover:bg-gray-900 
        transition shadow-sm"
      >
        {darkMode ? <FontAwesomeIcon icon={faSun} color="orange" size="xl"/> : <FontAwesomeIcon icon={faMoon} color="black" size="xl"/>}
      </button>

    </div>
  );
}

export default App