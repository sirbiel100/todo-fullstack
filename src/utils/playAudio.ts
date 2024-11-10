export default function PlayAudio(link : string, time? : number, volume? : number) {
    const audio = new Audio(link);
    audio.currentTime = time || 0;
    audio.volume = volume || 1;
    audio.play();
}