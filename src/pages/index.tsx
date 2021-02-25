import React from "react";
import Head from "next/head";

import CompletedChallenges from "../components/CompletedChallenges";
import Countdown from "../components/Countdown";
import ExperienceBar from "../components/ExperienceBar";
import Profile from "../components/Profile";
import ChallengeBox from "../components/ChallengeBox";

import styles from "../styles/pages/Home.module.css";
import { motion } from 'framer-motion';
import { CountdownProvider } from "../contexts/CountdownContext";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Início | Move.it</title>
      </Head>

      <motion.div
        transition={{ delay: 0.5, duration: 0.75 }}
        variants={{
          show: { opacity: 1, y: '0' },
          hidden: { opacity: 0, y: '100%' },
        }}
        initial="hidden"
        animate="show"
      >
        <ExperienceBar />
      </motion.div>


      <CountdownProvider>
        <section>
          <motion.div
            transition={{ delay: 1, duration: 0.75 }}
            variants={{
              show: { opacity: 1, y: '0' },
              hidden: { opacity: 0, y: '100%' },
            }}
            initial="hidden"
            animate="show"
          >
            <Profile />
            <CompletedChallenges />
            <Countdown />
          </motion.div>

          <motion.div
            transition={{ delay: 1.25, duration: 0.75 }}
            variants={{
              show: { opacity: 1, y: '0' },
              hidden: { opacity: 0, y: '100%' },
            }}
            initial="hidden"
            animate="show"
          >
            <ChallengeBox />

          </motion.div>
        </section>
      </CountdownProvider>
    </div>
  );
}
