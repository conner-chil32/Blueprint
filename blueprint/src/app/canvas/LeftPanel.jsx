"use client";

import { useEffect, useState, useRef } from "react";
import styles from './page.module.css';

export function LeftPanel({ createWidget }) {
    return (
        <div>
          <div className={styles.sectionTitle}>Objects</div>
          <button className={styles.categoryItem}>Text Box</button>
          <button className={styles.categoryItem}>Image</button>

          <div className={styles.divider}></div>

          <div className={styles.sectionTitle}>Widgets</div>
          <button className={styles.categoryItem} onClick={() => createWidget('video')}>Video</button>
          <button className={styles.categoryItem} onClick={() => createWidget('dropdown')}>Dropdown</button>
          <button className={styles.categoryItem} onClick={() => createWidget('advert')}>Advertisement</button>

          <div className={styles.divider}></div>

          <div className={styles.sectionTitle}>Shapes</div>
          <button className={styles.categoryItem} onClick={() => createWidget('box')}>Box</button>
          <button className={styles.categoryItem}>Forms</button>
          <button className={styles.categoryItem}>Images</button>
        </div>
    );
}