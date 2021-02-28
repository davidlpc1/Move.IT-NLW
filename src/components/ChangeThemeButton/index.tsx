import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { motionProps } from "../../utils/motionProps";
import styles from "../../styles/components/ChangeThemeButton.module.css";

export default function ChangeThemeButton() {
  const { theme, setTheme } = useTheme();

  return (
    <div className={styles.changeThemeButtonContainer}>
      <motion.button
        transition={{ delay: 0.1, duration: 0.5 }}
        {...motionProps}
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      >
        {theme === "light" && <img src="/icons/night.svg" alt="Dark" /> }
        {theme === "dark" && <img src="/icons/day.svg" alt="Light" /> }
      </motion.button>
    </div>
  );
}
