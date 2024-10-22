"use client"

import styles from "./page.module.scss";
import ToDo from "@/components/todo/todo.tsx";
import Header from "@/components/header/header";

export default function Home() {

  return (
    <section className={styles.page}>
      <Header />
      <ToDo />
    </section >
  );
}
