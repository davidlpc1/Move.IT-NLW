import { createContext, useState,ReactNode } from 'react';
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
}

interface ChallengesProviderProps {
    children: ReactNode;
}

export const ChallengesContext = createContext({} as ChallengesContextData);

export function ChallengesProvider({ children }:ChallengesProviderProps){
    const [level,setLevel] = useState(1);
    const [currentExperience,setCurrentExperience] = useState(30);
    const [challengesCompleted,setChallengesCompleted] = useState(0);

    const [activeChallenge,setActiveChallenge] = useState(null)
  
    const experienceToNextLevel = Math.pow(( level + 1 ) * 4,2)

    function levelup(){
      setLevel(level => level + 1)
    }

    function startNewChallenge(){
        const randomChallengeIndex = Math.floor(Math.random() * challenges.length)
        const challenge = challenges[randomChallengeIndex]

        setActiveChallenge(challenge)
    }

    function resetChallenge(){
        setActiveChallenge(null)
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
                resetChallenge
            }}
        >
            {children}
        </ChallengesContext.Provider>
    )
}