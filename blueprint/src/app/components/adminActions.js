import styles from './styles.module.css';
// adminActions.js
export default function ActionButton({ label, onClick }) {
    return (
        <button className={styles.adminButton} onClick={onClick}>
            {label}
        </button>
    );
}