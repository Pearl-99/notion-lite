import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import SortableBlock from "./SortableBlock";
import BlockRenderer from "./BlockRenderer";

export default function BlockList({
  currentPage,
  blocks,
  handleChange,
  handleKeyDown,
  handleDragEnd,
  blockRefs,
  activeBlockId,
  setActiveBlockId,
  handleDeleteBlock
}) 
{
  return (   
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>

      <SortableContext
        items={currentPage.blocks}
        strategy={verticalListSortingStrategy}
      >
        {currentPage.blocks.map((blockId, index) => {
          const block = blocks[blockId];

          return (
            <SortableBlock key={blockId} id={blockId} onDelete={() => handleDeleteBlock(blockId, index)}>

              <BlockRenderer
                block={block}
                blockRef={(el) => (blockRefs.current[blockId] = el)}
                onChange={(value) => handleChange(blockId, value)}
                onKeyDown={(e) => handleKeyDown(e, blockId, index)}
                isActive={activeBlockId === blockId}
                setActiveBlockId={setActiveBlockId}
              />

            </SortableBlock>
          );
        })}

      </SortableContext>
    </DndContext>
  );
}