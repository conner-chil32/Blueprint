import styles from './styles.module.css';
// adminActions.js
export default function ActionButton({ label }) {
    return (
        <button className={styles.adminButton}>{label}</button>
    );
}