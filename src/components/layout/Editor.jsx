import { useState } from "react";
import { useEffect } from "react";
import useBlockEditor from "../../hooks/useBlockEditor";
import SlashMenu from "./SlashMenu";
import BlockList from "../editor/BlockList";

export default function Editor({pages,currentPageId,blocks,setBlocks,setPages})
{   
    const currentPage=pages[currentPageId];

    if (!currentPage) 
    {
        return <div className="p-8">Loading...</div>;
    }
    
    const [showMenu,setShowMenu]=useState(false);

    const [activeBlockId,setActiveBlockId]=useState(null);

    const { handleKeyDown, blockRefs,handleDeleteBlock } = useBlockEditor({
        blocks,
        setBlocks,
        pages,
        setPages,
        currentPageId,
    });

        
    useEffect(() => {
        const firstBlockId = pages[currentPageId]?.blocks[0];

        if (firstBlockId) 
        {
            setTimeout(() => {
            blockRefs.current[firstBlockId]?.focus();
            }, 0);
        }
    }, [currentPageId]);


    function addBlock()
    {
        const blockId=Date.now().toString();

        setBlocks(prev => ({
            ...prev,
            [blockId]: {
                id: blockId,
                type: "text",
                content: "",
            }
            }));

        setPages((prev) => ({
            ...prev,
            [currentPageId]: {
            ...prev[currentPageId],
            blocks: [...prev[currentPageId].blocks, blockId],
            },
        }));

        setTimeout(() => {
            blockRefs.current[blockId]?.focus();
            }, 0);
    }

    function handleChange(blockId, value) 
    {

        if (typeof value === "string") 
        {
            if (value.startsWith("/")) 
            {
                setShowMenu(true);
                setActiveBlockId(blockId);
            } 
            
            else 
            {
                setShowMenu(false);
            }

            setBlocks((prev) => ({
                ...prev,
                [blockId]: {
                    ...prev[blockId],
                    content: value,
                },
            }));
        } 
        
        else 
        {
            setBlocks((prev) => ({
                ...prev,
                [blockId]: {
                    ...prev[blockId],
                    ...value,
                },
            }));
        }
    }
  
    function changeType(type) 
    {
        setBlocks((prev) => ({
            ...prev,
            [activeBlockId]: {
            ...prev[activeBlockId],
            type,
            content:"",
            ...(type === "image" && {
                url: "",
                width: 300,
                height: 200,
            }),
            },
        }));

        setShowMenu(false);

        setTimeout(()=>{blockRefs.current[activeBlockId]?.focus();},0);
    }

    function handleDragEnd(event) 
    {
        const { active, over } = event;

        if (!over || active.id === over.id) 
            return;

        const oldIndex = currentPage.blocks.indexOf(active.id);
        const newIndex = currentPage.blocks.indexOf(over.id);

        const newOrder = [...currentPage.blocks];
        const [moved] = newOrder.splice(oldIndex, 1);
        newOrder.splice(newIndex, 0, moved);

        setPages((prev) => ({
            ...prev,
            [currentPageId]: {
            ...prev[currentPageId],
            blocks: newOrder,
            },
        }));
    }
    
    return(
        <div className="flex-1 h-screen p-8 overflow-y-auto bg-white dark:bg-[#191919] text-gray-900 dark:text-gray-100">

            {currentPage.isLocked ? (
            <h1 className="text-4xl font-bold leading-relaxed mb-4 text-gray-900 dark:text-white">
                {currentPage.title}
            </h1>
            ) : (
            <input
                value={currentPage.title}
                onChange={(e) => {
                const value = e.target.value;

                setPages((prev) => ({
                    ...prev,
                    [currentPageId]: {
                    ...prev[currentPageId],
                    title: value,
                    },
                }));
                }}
                className="text-4xl font-bold leading-relaxed mb-4 outline-none bg-transparent"
            />
            )}
   
            <BlockList
                currentPage={currentPage}
                blocks={blocks}
                handleChange={handleChange}
                handleKeyDown={handleKeyDown}
                handleDragEnd={handleDragEnd}
                blockRefs={blockRefs}
                activeBlockId={activeBlockId}
                setActiveBlockId={setActiveBlockId}
                handleDeleteBlock={handleDeleteBlock}
            />
            {showMenu && <SlashMenu onSelect={changeType}/>}

            <button className="mt-6 ml-9 bg-black text-white hover:bg-gray-900 px-4 py-2 rounded-xl transition duration-200 ease-in-out transform hover:scale-105 shadow-sm dark:bg-gray-700 dark:hover:bg-gray-600" onClick={addBlock}>+ Add Block</button>

        </div>
    );
}