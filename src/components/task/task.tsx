import CheckIcon from "@/svg/check"
import CrossIcon from "@/svg/cross"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import style from "./task.module.scss"

export default function Task({ id, value, checked, deleteRequest, changeChecked }: { id: string, value: string, checked: boolean, deleteRequest: (id: string) => void, changeChecked: (id: string, checked: boolean) => void }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

    const transitionStyle = {
        transition,
        transform: CSS.Transform.toString(transform),
    };

    return (
        <div ref={setNodeRef} {...attributes} style={transitionStyle} className={style.task}>
            <div {...listeners} className={style.dragHandle}> {/* Only this part is draggable */}
                <span>⠿</span> {/* Or any icon you prefer as a drag handle */}
            </div>
            <input
                type="checkbox"
                id={id}
                defaultChecked={checked}
                onClick={() => {
                    changeChecked(id, checked);
                }}
            />
            <label htmlFor={id}>
                <div></div>
                <CheckIcon />
            </label>
            <p>{value} <div></div></p>
            <div onClick={() => deleteRequest(id)}>
                <CrossIcon />
            </div>
        </div>
    );
}
