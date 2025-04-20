import Navbar from "../components/navbar";
import styles from './page.module.css';

export default function CanvasPage() {
  return (
    <>
      <Navbar />
      <div className={styles.mainContainer}>
        <div className={styles.leftPanel}>
          <div className={styles.controlMenu}>
            <button onClick={() => alert('File')}>File</button>
            <button onClick={() => alert('Edit')}>Edit</button>
            <button onClick={() => alert('Undo')}>Undo</button>
            <button onClick={() => alert('Redo')}>Redo</button>
          </div>

          <div className={styles.sectionTitle}>Templates</div>
          <button className={styles.categoryItem}>Website Templates</button>
          <button className={styles.categoryItem}>Blog Templates</button>

          <div className={styles.divider}></div>

          <div className={styles.sectionTitle}>Text Elements</div>
          <button className={styles.categoryItem}>Headings</button>
          <button className={styles.categoryItem}>Paragraphs</button>

          <div className={styles.divider}></div>

          <div className={styles.sectionTitle}>UI Elements</div>
          <button className={styles.categoryItem}>Buttons</button>
          <button className={styles.categoryItem}>Forms</button>
          <button className={styles.categoryItem}>Images</button>
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