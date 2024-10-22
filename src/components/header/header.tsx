"use client"

import style from "./header.module.scss";
import MoonIcon from "@/svg/moon";
import SunIcon from "@/svg/sun";
import { useState } from "react"

export default function Header() {
    const [darkMode, setDarkMode] = useState<boolean>(false);
    return (
        <header className={style.header}>
            <h1>TODO</h1>

            <label htmlFor="colorTheme">
                {!darkMode && <MoonIcon />}
                {darkMode && <SunIcon />}
            </label>

            <input
                type="radio"
                value={darkMode ? "dark" : "light"}
                onClick={() => setDarkMode(!darkMode)}
                id="colorTheme"
            />

            <div></div> {/* Image background */}
        </header>
    )
}