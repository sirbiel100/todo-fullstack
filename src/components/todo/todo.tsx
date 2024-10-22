import style from './todo.module.scss';
import CheckIcon from '@/svg/check';
import CrossIcon from '@/svg/cross';
import CheckWindowWidth from '@/utils/checkScreenWidth';
import React, { useEffect, useState } from 'react';
import { Suspense } from 'react';


export default function ToDo() {

    return (
        <section className={style.todoSection}>

            <header>
                <div></div>
                <input type="text" placeholder='Create a new todo...' />
            </header>

            <main>
                <ul>
                    <li>
                        <input type="checkbox" id='list-1' />
                        <label htmlFor="list-1">
                            <div></div>
                            <CheckIcon />
                        </label>
                        <p>Wash the dishes <div></div></p>
                        <CrossIcon />
                    </li>

                    <li>
                        <input type="checkbox" id='list-2' />
                        <label htmlFor="list-2">
                            <div></div>
                            <CheckIcon />
                        </label>
                        <p>Go for a walk <div></div></p>
                        <CrossIcon />
                    </li>

                    <li>
                        <input type="checkbox" id='list-3' />
                        <label htmlFor="list-3">
                            <div></div>
                            <CheckIcon />
                        </label>
                        <p>Complete Todo App on Frontend Mentor <div></div></p>
                        <CrossIcon />
                    </li>

                    <li>
                        <input type="checkbox" id='list-4' />
                        <label htmlFor="list-4">
                            <div></div>
                            <CheckIcon />
                        </label>
                        <p>Test<div></div></p>
                        <CrossIcon />
                    </li>
                </ul>

                <FilterItems />
            </main>

            <footer>
                <p>Drag and drop to reorder the list</p>
            </footer>
        </section>
    )
}

function FilterItems() {
    "use client"
    const ScreenWidth = CheckWindowWidth();
    const isMobile = ScreenWidth <= 768;
    console.log(ScreenWidth)

    if (!ScreenWidth) return <></>
    if (ScreenWidth > 0) {
        return (
            <Suspense fallback={"..."}>
            <>

                {
                    isMobile && <section>
                        <div>
                            <p><span>3</span> items left</p>
                            <button>Clear Completed</button>
                        </div>
                        <ul>
                            <li>All</li>
                            <li>Active</li>
                            <li>Completed</li>
                        </ul>
                    </section>
                }

                {
                    !isMobile && <section>
                        <div>
                            <p><span>3</span> items left</p>
                            <ul>
                                <li>All</li>
                                <li>Active</li>
                                <li>Completed</li>
                            </ul>
                            <button>Clear Completed</button>
                        </div>
                    </section>
                }

            </>
            </Suspense>
        )

    }


}