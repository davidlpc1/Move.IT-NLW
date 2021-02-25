import { createContext, useState,ReactNode, useEffect } from 'react';
import challenges from '../../challenges.json';

interface Challenge{
    type:'body' | 'eye';
    description:string;
    amount:number;
}

interface ChallengesContextData {
    level:number;
    currentExperience:number;
    challengesCompleted:number;
    experienceToNextLevel:number;
    activeChallenge:Challenge;
    levelup:() => void;
    startNewChallenge:() => void;
    resetChallenge:() => void;
    completeChallenge:() => void;
}

interface ChallengesProviderProps {
    children: ReactNode;
}

export const ChallengesContext = createContext({} as ChallengesContextData);

export function ChallengesProvider({ children }:ChallengesProviderProps){
    const [level,setLevel] = useState(1);
    const [currentExperience,setCurrentExperience] = useState(0);
    const [challengesCompleted,setChallengesCompleted] = useState(0);

    const [activeChallenge,setActiveChallenge] = useState(null)
  
    const experienceToNextLevel = Math.pow(( level + 1 ) * 4,2)

    function levelup(){
      setLevel(level => level + 1)
    }

    useEffect(() => {
        Notification.requestPermission();
    },[])

    function startNewChallenge(){
        const randomChallengeIndex = Math.floor(Math.random() * challenges.length)
        const challenge = challenges[randomChallengeIndex]

        setActiveChallenge(challenge)

        new Audio('/notification.mp3').play();

        if(Notification.permission === "granted"){
            new Notification('Novo Desafio 🎉',{
                body: `Valendo ${challenge.amount}xp!`
            })
        }
    }

    function resetChallenge(){
        setActiveChallenge(null)
    }

    function completeChallenge(){
        if(!activeChallenge) return;

        const { amount } = activeChallenge;

        let finalExperience = currentExperience + amount;

        if(finalExperience >= experienceToNextLevel){
            finalExperience = finalExperience - experienceToNextLevel;
            levelup()
        }
        
        setCurrentExperience(finalExperience);
        setActiveChallenge(null);
        setChallengesCompleted(challengesCompleted + 1);
    }

    return (
        <ChallengesContext.Provider 
            value={{ 
                level,
                currentExperience,
                challengesCompleted,
                activeChallenge,
                experienceToNextLevel,
                levelup,
                startNewChallenge,
                resetChallenge,
                completeChallenge
            }}
        >
            {children}
        </ChallengesContext.Provider>
    )
}