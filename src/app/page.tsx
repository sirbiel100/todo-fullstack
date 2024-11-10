import styles from "./page.module.scss";
import ToDo from "@/components/todo/todo.tsx";
import Header from "@/components/header/header";
import AudioDetection from "@/components/audio/audio";

export default function Home() {

  return (
    <section className={styles.page}>
      <AudioDetection>
        <Header />
        <ToDo />
      </AudioDetection>
    </section >
  );
}
