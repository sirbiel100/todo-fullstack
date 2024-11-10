"use client"
import { TodoItem } from '@/types/todoInterface';
import { AudioContext } from '../audio/audio';
import { useContext, useEffect, useState } from 'react';
import { arrayMove  } from '@dnd-kit/sortable';
import { closestCenter, DndContext, PointerSensor, TouchSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import List from '../list/list';
import style from './todo.module.scss';
import PlayAudio from '@/utils/playAudio';


export default function ToDo() {
    const [data, setData] = useState<TodoItem[]>([])
    const [inputValue, setInputValue] = useState<string>('')
    const [isChecked, setIsChecked] = useState<boolean>(false)
    const [filter, setFilter] = useState<{ active: boolean; completed: boolean }>({
        active: false,
        completed: false
    })
    const [isDragging, setIsDragging] = useState<boolean>(false)
    const AllCheckedItems = data.filter(e => e.checked).map(e => e.id)
    const audio = useContext(AudioContext)

    const postRequest = async () => {

        if (!inputValue) return alert('Please enter a value')

        const res = await fetch('./api', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: Date.now(),
                value: inputValue,
                checked: false,
                position: Date.now() / 1000
            })
        })

        if (!res.ok) {
            // Handle HTTP errors
            const errorData = await res.json();
            console.error("Server Error:", errorData.message);
            return;
        }

        const newData = await res.json();
        console.log("Response Data:", newData);

        // Refetch data from database after adding new item
        const updatedData = await fetch('./api').then(res => res.json());
        setData(updatedData);
        setInputValue(''); // Reset input field

        if (audio) PlayAudio("../adding_pop.wav", 0, 0.7)
    }

    const deleteRequest = async (id: string | string[]) => {

        const res = await fetch('./api', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id })
        });

        if (!res.ok) {
            const errorData = await res.json();
            console.error("Delete Error:", errorData.message);
            return;
        }

        if (audio) PlayAudio("../deleted.wav", 0, 0.7)


        if (Array.isArray(id)) {
            // Filter out multiple items if `id` is an array
            console.log('Deleted multiple items:', id);
            setData((prevData) => prevData.filter((item) => !id.includes(item.id)));
        } else {
            // Filter out a single item if `id` is a string
            setData((prevData) => prevData.filter((item) => item.id !== id));
        }
    };

    const changeCheckedStatusOnDatabase = async (id: string, checked: boolean) => {
        setIsChecked(!isChecked)
        const res = await fetch('./api', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id, checked: !checked })
        })

        if (!res.ok) {
            const errorData = await res.json();
            console.error("Delete Error:", errorData.message);
            return;
        }

        setData((prevData) =>
            prevData.map(item =>
                item.id === id ? { ...item, checked: !checked } : item
            )
        );

        if (audio) PlayAudio("../checked-pop.wav")

    }

    useEffect(() => {
        const fecthData = async () => {
            const res = await fetch('./api').then(res => res.json())
            console.log(res)
            setData(res)
        }
        fecthData()
    }, [])

    const handleDragEnd = (event: DragEndEvent) => {
        setTimeout(() => setIsDragging(false), 500)
        const { active, over } = event
        const getTaskPos = (id: string) => data.findIndex(e => e.id === id)

        if (!over || active.id === over.id) return

        setData(prevData => {
            const originalIndex = getTaskPos(active.id as string)
            const newIndex = getTaskPos(over.id as string)
            const reorderedItems = arrayMove(prevData, originalIndex, newIndex);

            // Update positions in the backend
            updatePositionsInDatabase(reorderedItems);

            return reorderedItems;
        })

        if (audio) PlayAudio('../pop.mp3', 0, 0.7)
    }

    const handleDragStart = () => {
        setIsDragging(true)

        if (audio) PlayAudio('../plunger_pop.wav', 0.14, 0.7)
    }

    const updatePositionsInDatabase = async (orderedItems: TodoItem[]) => {
        const positions = orderedItems.map((item, index) => ({ id: item.id, position: index }));

        await fetch('./api', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ positions })
        });
    };

    const playAudioOnHover = () => {
        if (isDragging) return // Prevent audio from playing when dragging

        if (audio) PlayAudio('../woosh.wav', 0, 0.3)
    }

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(TouchSensor),
    )


    return (
        <section className={style.todoSection}>

            <header>
                <div onClick={postRequest}></div>
                <input
                    type="text"
                    placeholder='Create a new todo...'
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyUp={(e) => e.key === 'Enter' && postRequest()}
                />
            </header>


            <main>
                <ul>
                    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd} onDragStart={handleDragStart} sensors={sensors}>
                        <List
                            tasks={data}
                            key={data.map(e => e.id).join('')}
                            changeChecked={(id: string, checked: boolean) => changeCheckedStatusOnDatabase(id, checked)}
                            deleteRequest={(id: string) => deleteRequest(id)}
                            filter={filter}
                            onHover={() => playAudioOnHover()}
                        />
                    </DndContext>
                </ul>

                <section>
                    <div>
                        <p><span>{data.filter(item => !item.checked).length}</span> items left</p>
                        <ul>
                            <li onClick={() => { setFilter({ ...filter, completed: false, active: false }) }}>All</li>
                            <li onClick={() => { setFilter({ ...filter, completed: false, active: true }) }}>Active</li>
                            <li onClick={() => { setFilter({ ...filter, completed: true, active: false }) }}>Completed</li>
                        </ul>
                        <button onClick={() => deleteRequest(AllCheckedItems)}>Clear Completed</button>
                    </div>
                </section>
            </main>

            <footer>
                <p>Drag and drop to reorder the list</p>
            </footer>


        </section>
    )

}


/*
 *      const shouldDisplay = (filter.completed && item.checked) ||
 *                            (filter.active && !item.checked) ||
 *                            (!filter.active && !filter.completed);
 *                            
 *                            
 */