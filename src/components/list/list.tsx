import { TodoItem } from "@/types/todoInterface";
import style from "./list.module.scss";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import Task from "../task/task";

export default function List({ tasks, deleteRequest, changeChecked, filter, onHover }: { tasks: TodoItem[], deleteRequest: (id: string) => void, changeChecked: (id: string, checked: boolean) => void, filter: { active: boolean, completed: boolean }, onHover: () => void }) {


    return (

        <SortableContext items={tasks} strategy={verticalListSortingStrategy}>
            {tasks && tasks.map((task, index) => {
                const shouldDisplay = (filter.completed && task.checked) ||
                    (filter.active && !task.checked) ||
                    (!filter.active && !filter.completed);
                return (
                    <li
                        key={index}
                        className={!shouldDisplay ? style.hide : style.list}
                        onMouseEnter={() => onHover()}
                        onTouchStart={() => onHover()}
                    >
                        <Task
                            changeChecked={() => changeChecked(task.id, task.checked)}
                            deleteRequest={() => deleteRequest(task.id)}
                            checked={task.checked}
                            id={task.id}
                            value={task.value}
                        />
                    </li>
                )
            })}
        </SortableContext>

    )
}