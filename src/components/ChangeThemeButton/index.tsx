import { useTheme } from "next-themes";
import styles from '../../styles/components/ChangeThemeButton.module.css';

export default function ChangeThemeButton() {
  const { theme, setTheme } = useTheme();

  return (
    <div className={styles.changeThemeButtonContainer}>
      {theme === "light" && (
        <button onClick={() => setTheme("dark")}>
          <img src="/icons/night.svg" alt="Dark"/>
        </button>
      )}
      {theme === "dark" && (
        <button onClick={() => setTheme("light")}>
          <img src="/icons/day.svg" alt="Light"/>
        </button>
      )}
    </div>
  );
}
