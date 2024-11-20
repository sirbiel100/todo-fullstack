"use client"
import { TodoItem } from '@/types/todoInterface';
import { AudioContext } from '../audio/audio';
import { useContext, useEffect, useState } from 'react';
import { arrayMove } from '@dnd-kit/sortable';
import { closestCenter, DndContext, PointerSensor, TouchSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import List from '../list/list';
import style from './todo.module.scss';
import PlayAudio from '@/utils/playAudio';
import { supabase } from '@/app/lib/supabase';


export default function ToDo() {
    const [listData, setListData] = useState<TodoItem[]>([])
    const [inputValue, setInputValue] = useState<string>('')
    const [isChecked, setIsChecked] = useState<boolean>(false)
    const [filter, setFilter] = useState<{ active: boolean; completed: boolean }>({
        active: false,
        completed: false
    })
    const [isDragging, setIsDragging] = useState<boolean>(false)
    const [loadingCursor, setLoadingCursor] = useState<boolean>(false)
    const AllCheckedItems = listData.filter(e => e.checked).map(e => e.id)
    const audio = useContext(AudioContext)

    const postRequest = async (currentListData: TodoItem[]) => {

        if (!inputValue) return alert('Please enter a value')
        if (currentListData.length > 19) return alert('You have reached the maximum number of items');

        setLoadingCursor(true)
        setTimeout(() => {
            setLoadingCursor(false)
        }, 1000)

        const { data, error } = await supabase
            .from("list")
            .insert({
                id: Date.now(),
                value: inputValue,
                checked: false,
                position: Math.floor(Date.now() / 1000)
            })
            .select("*")
            .order('position', { ascending: true })


        if (error) {
            // Handle HTTP errors
            console.error("Server Error:", error);
            return;
        }

        if (!data) return console.error("Data is null")

        console.log("Response Data:", data);

        // Refetch data from database after adding new item

        const { data: listData, error: fetchError } = await supabase.from("list").select("*");
        if (fetchError) {
            console.error("Error fetching data:", fetchError);
            return;
        }
        setListData(listData || []);
        setInputValue(''); // Reset input field

        if (audio) PlayAudio("../adding_pop.wav", 0, 0.7)
    }

    const deleteRequest = async (id: string | string[]) => {

        if(!id || id.length == 0 ) return alert('Please select an item to delete')

        let response;

        if (Array.isArray(id)) {
            // Use .in() for multiple IDs
            response = await supabase
                .from('list')
                .delete()
                .in('id', id);
        } else {
            // Use .eq() for a single ID
            response = await supabase
                .from('list')
                .delete()
                .eq('id', id);
        }

        if (response.error) {
            console.error("Delete Error:", response);
            return;
        }

        if (audio) PlayAudio("../deleted.wav", 0, 0.7)


        if (Array.isArray(id)) {
            // Filter out multiple items if `id` is an array
            console.log('Deleted multiple items:', id);
            setListData((prevData) => prevData.filter((item) => !id.includes(item.id)));
        } else {
            // Filter out a single item if `id` is a string
            setListData((prevData) => prevData.filter((item) => item.id !== id));
        }
    };

    const changeCheckedStatusOnDatabase = async (id: string, checked: boolean) => {
        setIsChecked(!isChecked)
        const { error } = await supabase
            .from('list')
            .update({ checked: !checked })
            .eq('id', id)

        if (error) {
            console.error("Delete Error:", error.message);
            return;
        }

        setListData((prevData) =>
            prevData.map(item =>
                item.id === id ? { ...item, checked: !checked } : item
            )
        );

        if (audio) PlayAudio("../checked-pop.wav")

    }

    useEffect(() => {
        const fetchData = async () => {
            const { data, error } = await supabase
                .from("list")
                .select("*")
                .order('position', { ascending: true })
            if (data) {
                setListData(data);
            } else {
                console.error("Error fetching data: data is null: ", error);
            }
        }

        fetchData()

    }, [])

    const handleDragEnd = (event: DragEndEvent) => {
        setTimeout(() => setIsDragging(false), 500)
        const { active, over } = event
        const getTaskPos = (id: string) => listData.findIndex(e => e.id === id)

        if (!over || active.id === over.id) return

        setListData(prevData => {
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

        for (const { id, position } of positions) {
            const { error } = await supabase
                .from('list')
                .update({ position })
                .eq('id', id);

            if (error) {
                console.error("Update Error:", error.message);
                return;
            }
        }

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
        <section className={style.todoSection} style={{cursor: loadingCursor ? "progress" : ""}}>

            <header>
                <div onClick={() => postRequest(listData)}></div>
                <input
                    type="text"
                    placeholder='Create a new todo...'
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyUp={(e) => e.key === 'Enter' && postRequest(listData)}
                    style={{cursor: loadingCursor ? "progress" : ""}}
                />
            </header>


            <main>
                <ul>
                    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd} onDragStart={handleDragStart} sensors={sensors}>
                        <List
                            tasks={listData}
                            key={listData.map(e => e.id).join('')}
                            changeChecked={(id: string, checked: boolean) => changeCheckedStatusOnDatabase(id, checked)}
                            deleteRequest={(id: string) => deleteRequest(id)}
                            filter={filter}
                            onHover={() => playAudioOnHover()}
                        />
                    </DndContext>
                </ul>

                <section>
                    <div>
                        <p><span>{listData.filter(item => !item.checked).length}</span> items left</p>
                        <ul>
                            <li onClick={() => { setFilter({ ...filter, completed: false, active: false }) }} style={{color: !filter.active && !filter.completed ? "#3a7bfd" : ""}}>All</li>
                            <li onClick={() => { setFilter({ ...filter, completed: false, active: true }) }} style={{color: filter.active && !filter.completed ? "#3a7bfd" : ""}}>Active</li>
                            <li onClick={() => { setFilter({ ...filter, completed: true, active: false }) }} style={{color: !filter.active && filter.completed ? "#3a7bfd" : ""}}>Completed</li>
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