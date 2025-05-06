import "./App.css";
import {
  useDroppable,
  DndContext,
  useDraggable,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";

interface TaskType {
  id: string;
  task: string;
  card: string;
}

const tasks_initial: TaskType[] = [
  {
    id: "1",
    task: "go to gym",
    card: "any",
  },
  {
    id: "2",
    task: "go to home",
    card: "any",
  },
  {
    id: "3",
    task: "go to study",
    card: "any",
  },
];

function App() {
  const [tasks, setTasks] = useState<TaskType[]>(tasks_initial);
  const [isOver, setIsOver] = useState<boolean>(false);
  const ondragstart = (e: DragStartEvent) => {
    const { active } = e;
    console.log(active.id, "drag start");
  };

  const ondragend = (e: DragEndEvent) => {
    const { active, over } = e;
    if (over) {
      console.log(over.id, "drag end");

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === active.id ? { ...task, card: String(over.id) } : task
        )
      );

      setIsOver(false)
    }
  };

  const ondragover = (e: DragOverEvent) => {
    const {active, over} = e;
    if(over){
      setIsOver(true);
    }
  }

  return (
    <div>
      <DndContext onDragStart={ondragstart} onDragEnd={ondragend} onDragOver={ondragover}>
        {/* Components that use `useDraggable`, `useDroppable` */}
        <Droppable id="doing" tasks={tasks} isOver={isOver}/>
        <Droppable id="any" tasks={tasks} isOver={isOver}/>
      </DndContext>
    </div>
  );
}

interface DroppableProps {
  id: string;
  tasks: TaskType[];
  isOver: boolean;
}

function Droppable({ id, tasks , isOver}: DroppableProps) {
  const { setNodeRef } = useDroppable({
    id: id,
  });

  return (
    <>
      <div ref={setNodeRef} className="m-2 py-4 w-56 h-56 bg-amber-100">
        {isOver && <div className="px-2 w-11/12 h-9 my-2 mx-auto bg-black"></div>}
        {tasks
          .filter((task) => task.card === id)
          .map((task: TaskType) => (
            <Task key={task.id} task={task} />
          ))}
      </div>
    </>
  );
}

//will render a task
interface TaskCompType {
  task: TaskType;
}

function Task({ task }: TaskCompType) {
  const { attributes, listeners, transform, setNodeRef } = useDraggable({
    id: task.id,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  return (
    <>
      <div
        ref={setNodeRef}
        className="flex items-center px-2 w-11/12 h-9 my-2 mx-auto bg-black rounded-[8px] text-white"
        {...listeners}
        {...attributes}
        style={style}
      >
        {task.task}
      </div>
    </>
  );
}

export default App;
