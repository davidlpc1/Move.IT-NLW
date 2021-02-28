import { GetServerSideProps } from "next";

import Head from "../components/Head";
import Sidebar from "../components/Sidebar";

import ChangeThemeButton from "../components/ChangeThemeButton";

import { motion } from "framer-motion";
import { motionProps } from "../utils/motionProps";

import styles from "../styles/pages/Leaderboard.module.css";
import { useRouter } from "next/router";
import { useEffect } from "react";

interface LeaderboardProps {
  users: [
    {
      name: string;
      challengesCompleted: number;
      level: number;
      currentExperience: number;
      totalExperience: number;
    }
  ];
  username: string;
}

export default function Leaderboard({ users, username }: LeaderboardProps) {
  const router = useRouter();
  useEffect(() => {
    if(username === "undefined")  router.push('/')
  },[])

  return (
    <section className={styles.leaderboardContainer}>
      <Head title="Leaderboard | Move.it" />

      <Sidebar homeIsActive={false} />
      <ChangeThemeButton />

      <main className={styles.mainContent}>
        <motion.h1
          transition={{ delay: 0.25, duration: 0.75 }}
          {...motionProps}
        >
          Leaderboard
        </motion.h1>

        <motion.table
          transition={{ delay: 0.6, duration: 0.75 }}
          {...motionProps}
          cellSpacing="1"
          cellPadding="0"
        >
          <thead>
            <tr>
              <th>Posição</th>
              <th>Usuário</th>
              <th>Desafios</th>
              <th>Experiência</th>
            </tr>
          </thead>
          <tr className={styles.space} />
          <tbody>
            {users.map((user, index) => (
              <>
                <tr key={`${user.name}-${index}`} tabIndex={index + 1}>
                  <td>{index + 1}</td>
                  <td className={styles.userData}>
                    <img
                      src={`https://github.com/${user.name}.png`}
                      alt={user.name}
                    />
                    <div>
                      <h3>{user.name}</h3>
                      <span>
                        <img src="/icons/level-up.svg" alt="Level Up" />
                        Level {user.level}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span className={styles.numberValueInPurple}>
                      {user.challengesCompleted}
                    </span>{" "}
                    Completados
                  </td>
                  <td>
                    <span className={styles.numberValueInPurple}>
                      {user.totalExperience}
                    </span>{" "}
                    xp
                  </td>
                </tr>
                <div className={styles.space} />
              </>
            ))}
          </tbody>
        </motion.table>
      </main>
    </section>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const users = require("./api/users.json");
  users.sort((a, b) => {
    if (a.level < b.level) {
      return 1;
    }
    if (a.level > b.level) {
      return -1;
    }
    return 0;
  });

  const { username } = context.req.cookies;

  return {
    props: {
      users,
      username: String(username),
    },
  };
};
