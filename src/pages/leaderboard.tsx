import { GetServerSideProps } from "next";

import Head from "../components/Head";
import Sidebar from "../components/Sidebar";

import ChangeThemeButton from "../components/ChangeThemeButton";

import styles from "../styles/pages/Leaderboard.module.css";

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
}

export default function Leaderboard({ users }: LeaderboardProps) {
  console.log(users);
  return (
    <section className={styles.leaderboardContainer}>
      <Head title="Leaderboard | Move.it" />

      <Sidebar homeIsActive={false} />
      <ChangeThemeButton />

      <main className={styles.mainContent}>
        <h1>Leaderboard</h1>

        <table>
          <thead>
            <th>Posição</th>
            <th>Usuário</th>
            <th>Desafios</th>
            <th>Experiência</th>
          </thead>
          <tbody>
            {users.map((user,index) => (
              <tr>
                <td>{index + 1}</td>
                <td className={styles.userData}>
                  <img src={`https://github.com/${user.name}.png`} alt={user.name} />
                  <div>
                    <h3>{user.name}</h3>
                    <span>
                      <img src="/icons/level-up.svg" alt="Level Up" />
                      Level {user.level}
                    </span>
                  </div>
                </td>
                <td>{user.challengesCompleted} Completados</td>
                <td>{user.totalExperience} Completados</td>
              </tr>
            ))}
          </tbody>
        </table>
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

  return {
    props: {
      users,
    },
  };
};
