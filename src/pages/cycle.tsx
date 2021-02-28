import { GetServerSideProps } from "next";
// import createUser from "./api/createUser";

import Head from "../components/Head";
import CompletedChallenges from "../components/CompletedChallenges";
import Countdown from "../components/Countdown";
import ExperienceBar from "../components/ExperienceBar";
import Profile from "../components/Profile";
import ChallengeBox from "../components/ChallengeBox";
import Sidebar from "../components/Sidebar";

import styles from "../styles/pages/Home.module.css";
import { CountdownProvider } from "../contexts/CountdownContext";
import { ChallengesProvider } from "../contexts/ChallengesContext";

import { motion } from "framer-motion";
import { motionProps } from "../utils/motionProps";
import ChangeThemeButton from "../components/ChangeThemeButton";
import { useRouter } from "next/router";
import { useEffect } from "react";

interface HomeProps {
  level: number;
  currentExperience: number;
  challengesCompleted: number;
  username: string;
}

export default function Home(props: HomeProps) {
  const router = useRouter();
  useEffect(() => {
    if(props.username === "undefined")  router.push('/')
  },[])

  return (
    <ChallengesProvider
      level={props.level}
      currentExperience={props.currentExperience}
      challengesCompleted={props.challengesCompleted}
    >
      <div className={styles.container}>
        <Head title="Início | Move.it" />

        <Sidebar homeIsActive={true} />
        <ChangeThemeButton />

        <motion.div
          transition={{ delay: 0.5, duration: 0.75 }}
          {...motionProps}
        >
          <ExperienceBar />
        </motion.div>

        <CountdownProvider>
          <section>
            <motion.div
              transition={{ delay: 1, duration: 0.75 }}
              {...motionProps}
            >
              <Profile name={props.username} />
              <CompletedChallenges />
              <Countdown />
            </motion.div>

            <motion.div
              transition={{ delay: 1.25, duration: 0.75 }}
              {...motionProps}
            >
              <ChallengeBox />
            </motion.div>
          </section>
        </CountdownProvider>
      </div>
    </ChallengesProvider>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const {
    level,
    currentExperience,
    challengesCompleted,
    username,
  } = context.req.cookies;
  
  return {
    props: {
      level: Number(level),
      currentExperience: Number(currentExperience),
      challengesCompleted: Number(challengesCompleted),
      username: String(username),
    },
  };
};
