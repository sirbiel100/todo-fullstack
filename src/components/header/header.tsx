"use client";

import style from "./header.module.scss";
import MoonIcon from "@/svg/moon";
import SunIcon from "@/svg/sun";
import { useContext, useState } from "react";
import PlayAudio from "@/utils/playAudio";
import { AudioContext } from "../audio/audio";

export default function Header() {
    const audio = useContext(AudioContext);

    
    // Initialize darkMode based on the stored color scheme in localStorage
    const [darkMode, setDarkMode] = useState<boolean>(() => {
        return localStorage.getItem('colorScheme') === 'dark';
    });

    const toggleColorScheme = () => {
        const newDarkMode = !darkMode;
        setDarkMode(newDarkMode);
        
        // Update localStorage
        const newColorScheme = newDarkMode ? 'dark' : 'light';
        localStorage.setItem('colorScheme', newColorScheme);

        if (audio) PlayAudio('../color-scheme-sound.wav');
    
    };

    return (
        <header className={style.header}>
            <h1>TODO</h1>

            <label htmlFor="colorTheme">
                {!darkMode ? <MoonIcon /> : <SunIcon />}
            </label>

            <input
                type="radio"
                value={darkMode ? 'dark' : 'light'}
                checked={darkMode}
                onClick={toggleColorScheme}
                id="colorTheme"
                readOnly
            />

            <div></div> {/* Image background */}
        </header>
    );
}
