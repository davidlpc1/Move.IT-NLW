import Head from "next/head";
import { GetServerSideProps } from "next";

import Sidebar from "../components/Sidebar";

import { ChallengesProvider } from "../contexts/ChallengesContext";
import ChangeThemeButton from "../components/ChangeThemeButton";

interface HomeProps {
  level:number ;
  currentExperience:number ;
  challengesCompleted:number ;
}

export default function Home(props:HomeProps) {
  return (
    <ChallengesProvider 
      level={props.level} 
      currentExperience={props.currentExperience} 
      challengesCompleted={props.challengesCompleted} 
    >
      <div>
        <Head>
          <title>LeaderBoard | Move.it</title>
        </Head>

        <Sidebar homeIsActive={false} />
        <ChangeThemeButton />
      </div>
    </ChallengesProvider>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { level, currentExperience, challengesCompleted } = context.req.cookies;

  return {
    props: {
      level: Number(level),
      currentExperience:Number(currentExperience),
      challengesCompleted:Number(challengesCompleted),
    },
  };
};
