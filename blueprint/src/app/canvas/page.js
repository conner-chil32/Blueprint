import Navbar from "../components/navbar";
import styles from "./page.module.css";

export default function CanvasPage() {
  return (
    <>
      <Navbar />
      <div className={styles.mainContainer}>
        <div className={styles.leftPanel}>
          <div className={styles.controlMenu}>
            <button type="button">File</button>
            <button type="button">Edit</button>
            <button type="button">Undo</button>
            <button type="button">Redo</button>
          </div>

          <div className={styles.sectionTitle}>Templates</div>
          <button className={styles.categoryItem} type="button">Website Templates</button>
          <button className={styles.categoryItem} type="button">Blog Templates</button>

          <div className={styles.divider}></div>

          <div className={styles.sectionTitle}>Text Elements</div>
          <button className={styles.categoryItem} type="button">Headings</button>
          <button className={styles.categoryItem} type="button">Paragraphs</button>

          <div className={styles.divider}></div>

          <div className={styles.sectionTitle}>UI Elements</div>
          <button className={styles.categoryItem} type="button">Buttons</button>
          <button className={styles.categoryItem} type="button">Forms</button>
          <button className={styles.categoryItem} type="button">Images</button>
        </div>

        <div className={styles.canvasArea}>
          <div className={styles.canvasContent} id="canvas">
            Drop elements here to build your page
          </div>
        </div>
      </div>
    </>
  );
}
