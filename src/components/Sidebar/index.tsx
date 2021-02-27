import styles from '../../styles/components/Sidebar.module.css';
import { motion } from 'framer-motion';
import Link from '../Link';

interface SidebarProps {
    homeIsActive: boolean;
}

export default function Sidebar({ homeIsActive }: SidebarProps){
    return (
        <motion.div 
            className={styles.sidebarContainer}
            transition={{ delay: 0.2, duration: 0.75 }}
            variants={{
                show: { opacity: 1, y: "0" },
                hidden: { opacity: 0, y: "100%" },
            }}
            initial="hidden"
             animate= "show"
        >
            <header>
                <Link href="/">
                    <img src="/icons/logo.svg" alt="MoveIT" />
                </Link>
            </header>

            <main>
                {homeIsActive ? (
                    <>
                        <Link href="/cycle">
                            <img src="/icons/home-active.svg" alt="Home" className={styles.imageActive}/>
                        </Link>
                        <Link href="/leaderboard">
                            <img src="/icons/leaderboard.svg" alt="Leaderboard"/>
                        </Link>
                    </>
                ) : (
                    <>
                        <Link href="/cycle">
                            <img src="/icons/home.svg" alt="Home"/>
                        </Link>
                        <Link href="/leaderboard">
                            <img src="/icons/leaderboard-active.svg" alt="Leaderboard" className={styles.imageActive}/>
                        </Link>
                    </>
                )}
            </main>
        </motion.div>
    )
} 