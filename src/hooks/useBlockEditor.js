import { useRef } from "react";

export default function useBlockEditor({
    pages,currentPageId,blocks,setBlocks,setPages})
{

    const blockRefs = useRef({});

    function handleKeyDown(e,blockId,index)
    {
        if(e.key === "Enter")
        {
            e.preventDefault();

            const newId=Date.now().toString();

            const newBlock={
                id: newId,
                type:"text",
                content:""
            };

            setBlocks(prev => ({
                ...prev,
                [newId]: newBlock
                }));

            const updatedBlocks=[...pages[currentPageId].blocks];

            updatedBlocks.splice(index+1,0,newId);

            setPages({...pages,
            [currentPageId]:{
                ...pages[currentPageId],
                blocks:updatedBlocks
            }
            });

            setTimeout(() => {
            blockRefs.current[newId]?.focus();}, 0);
        }

        if (e.key === "Backspace") 
        {
            const currentBlock = blocks[blockId];

            if (currentBlock.content === "") 
            {
                e.preventDefault();

                const prevBlockId = pages[currentPageId].blocks[index - 1];

                setBlocks((prev) => {
                const updated = { ...prev };
                delete updated[blockId];
                return updated;
                });

                setPages((prev) => {
                const updatedBlocks = prev[currentPageId].blocks.filter(
                    (id) => id !== blockId
                );

                return {
                    ...prev,
                    [currentPageId]: {
                    ...prev[currentPageId],
                    blocks: updatedBlocks,
                    },
                };
                });

                setTimeout(() => {
                blockRefs.current[prevBlockId]?.focus();
                }, 0);
            }

            else if (e.target.selectionStart === 0 && index > 0) 
            {
                e.preventDefault();

                const prevBlockId = pages[currentPageId].blocks[index - 1];
                const prevBlock = blocks[prevBlockId];

                const mergedContent =
                prevBlock.content + currentBlock.content;

                setBlocks((prev) => {
                const updated = { ...prev };

                updated[prevBlockId] = {
                    ...prevBlock,
                    content: mergedContent,
                };

                delete updated[blockId];

                return updated;
                });

                setPages((prev) => {
                const updatedBlocks = prev[currentPageId].blocks.filter(
                    (id) => id !== blockId
                );

                return {
                    ...prev,
                    [currentPageId]: {
                    ...prev[currentPageId],
                    blocks: updatedBlocks,
                    },
                };
                });

                setTimeout(() => {
                const el = blockRefs.current[prevBlockId];
                el?.focus();

                const length = prevBlock.content.length;
                el?.setSelectionRange(length, length);
                }, 0);
            }
        }
    }

    function handleDeleteBlock(blockId, index) 
    {
        const prevBlockId = pages[currentPageId].blocks[index - 1];
        const nextBlockId = pages[currentPageId].blocks[index + 1];

        setBlocks((prev) => {
            const updated = { ...prev };
            delete updated[blockId];
            return updated;
        });

        setPages((prev) => {
            const updatedBlocks = prev[currentPageId].blocks.filter(
            (id) => id !== blockId
            );

            return {
            ...prev,
            [currentPageId]: {
                ...prev[currentPageId],
                blocks: updatedBlocks,
            },
            };
        });

        const focusId = nextBlockId || prevBlockId;

        setTimeout(() => {
            blockRefs.current[focusId]?.focus();
        }, 0);
        }

    return { handleKeyDown,blockRefs, handleDeleteBlock };
    
}