import { Section } from &quot;@prisma/client&quot;;
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from &quot;@hello-pangea/dnd&quot;;
import { useEffect, useState } from &quot;react&quot;;
import { Grip, Pencil } from &quot;lucide-react&quot;;

interface SectionListProps {
  items: Section[];
  onReorder: (updateData: { id: string; position: number }[]) => void;
  onEdit: (id: string) => void;
}

const SectionList = ({ items, onReorder, onEdit }: SectionListProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [sections, setSections] = useState(items);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setSections(items);
  }, [items]);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(sections);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const startIndex = Math.min(result.source.index, result.destination.index);
    const endIndex = Math.max(result.source.index, result.destination.index);

    const updatedSections = items.slice(startIndex, endIndex + 1);

    setSections(items);

    const bulkUpdateData = updatedSections.map((section: Section) => ({
      id: section.id,
      position: items.findIndex((item: Section) => item.id === section.id),
    }));

    onReorder(bulkUpdateData);
  };

  if (!isMounted) return null;

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="sections&quot;>
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={`${
              sections.length > 0 ? &quot;my-10&quot; : &quot;mt-7&quot;
            } flex flex-col gap-5`}
          >
            {sections.map((section: Section, index: number) => (
              <Draggable
                key={section.id}
                draggableId={section.id}
                index={index}
              >
                {(provided) => (
                  <div
                    {...provided.draggableProps}
                    ref={provided.innerRef}
                    className=&quot;flex items-center bg-[#FFF8EB] rounded-lg text-sm font-medium p-3&quot;
                  >
                    <div {...provided.dragHandleProps}>
                      <Grip className=&quot;h-4 w-4 cursor-pointer mr-4 hover:text-[#FDAB04]&quot; />
                    </div>
                    {section.title}
                    <div className=&quot;ml-auto&quot;>
                      <Pencil
                        className=&quot;h-4 w-4 cursor-pointer hover:text-[#FDAB04]"
                        onClick={() => onEdit(section.id)}
                      />
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default SectionList;
