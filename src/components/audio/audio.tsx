"use client"
import SoundPlaying from "@/svg/playingSound";
import MutedSound from "@/svg/soundMuted";
import { createContext } from "react";
import style from './audio.module.scss'
import { useState } from "react";
import PlayAudio from "@/utils/playAudio";

export const AudioContext = createContext<boolean>(true)

export default function AudioDetection({ children }: { children: React.ReactNode }) {
    const [audio, setAudio] = useState<boolean>(true)

    const audioSettings = () => {
        setAudio(!audio)

        if (!audio){
            PlayAudio('../volume_on.wav', 0, 0.2)
        }
    }

    return (
        <AudioContext.Provider value={audio}>
            <div className={style.audioStyle} onClick={() => audioSettings()}>
                {audio ? <SoundPlaying /> : <MutedSound />}
            </div>
            {children}
        </AudioContext.Provider>
    )
}