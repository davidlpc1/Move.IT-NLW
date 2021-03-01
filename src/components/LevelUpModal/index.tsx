import { useContext, useEffect, useState } from 'react';
import Confetti from 'react-canvas-confetti';
import { ChallengesContext } from '../../contexts/ChallengesContext';
import styles from '../../styles/components/LevelUpModal.module.css';
import Link from '../Link';

export default function LevelUpModal(){
    const { level,closeLevelUpModal } = useContext(ChallengesContext);
    const [fire,setFire] = useState(false);
    const [reset,setReset] = useState(false);

    useEffect(() => {
        setFire(true);
        setTimeout(() => {
            setReset(true);
            setFire(false);
        }, 4 * 1000)
    },[])
    
    return (
        <div className={styles.overlay}>
            <Confetti
                style={{ position:"fixed",width:"100%",height:"100%",zIndex:-1 }}
                fire={fire}
                reset={reset}
            />
            <div className={styles.container}>
                <header>{level}</header>

                <strong>Parábens</strong>
                <p>Você alcançou um novo level</p>

                <button type="button" onClick={closeLevelUpModal}>
                    <img src="/icons/close.svg" alt="Fechar Modal" />
                </button>

                <Link href="/cycle">
                    <img src="/icons/twitter.svg" alt="Twitter" />
                    Compartilhar no twitter
                </Link>
            </div>
        </div>
    )
}