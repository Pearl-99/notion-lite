import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faGripVertical,faTrash} from "@fortawesome/free-solid-svg-icons";

export default function SortableBlock({ id, children, onDelete }) 
{
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };


  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="group flex items-start gap-2 "
    >

        <div
          {...listeners}
          className="cursor-grab px-2 text-gray-300 hover:text-gray-600 transition"
        >
          <div className="opacity-0 pt-3 group-hover:opacity-100 transition">
          <FontAwesomeIcon icon={faGripVertical} size="s" className="text-gray-400"/>
          </div>
        </div>

        <div className="flex-1 ">
          {children}
        </div>

        <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="opacity-0 pt-3 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition"
          >
            <FontAwesomeIcon icon={faTrash} size="s" />
        </button>

    </div>
  );
}