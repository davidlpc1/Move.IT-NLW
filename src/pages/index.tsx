import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";

import Cookies from "js-cookie";

import styles from "../styles/pages/Login.module.css";

import { motion } from "framer-motion";
import { motionProps } from "../utils/motionProps";

export default function Login() {
  const router = useRouter();
  // const [name, setName] = useState("");

  // function handleNameChange(event) {
  //   setName(event.target.value);
  // }

  async function handleSubmit(event) {
    event.preventDefault();
    router.push('https://github.com/login/oauth/authorize?client_id=4974563f2c8d1922e576')
  }

  return (
    <div className={styles.loginContainer}>
      <Head>
        <title>Login | Move.it</title>
      </Head>

      <img src="/icons/logo-background.svg" alt="Move It Icon" />

      <section>
        <motion.img
          transition={{ delay: 0.25, duration: 0.75 }}
          {...motionProps}
          src="/icons/logo-complete.svg"
          alt="Move.it"
        />
        <motion.h2
          transition={{ delay: 0.25, duration: 0.75 }}
          {...motionProps}
        >
          Bem-vindo
        </motion.h2>

        <motion.div
          transition={{ delay: 0.5, duration: 0.75 }}
          {...motionProps}
        >
          <img src="/icons/github.svg" alt="Github" />
          <span>Clique e faça login com seu Github para começar</span>
        </motion.div>

        <motion.form
          transition={{ delay: 0.75, duration: 0.75 }}
          {...motionProps}
          onSubmit={handleSubmit}
        >
          {/* <input
            type="text"
            placeholder="Digite seu username"
            value={name}
            onChange={handleNameChange}
          /> */}
          <button type="submit">
            <img src="/icons/arrow.svg" alt="Submit" />
          </button>
        </motion.form>
      </section>
    </div>
  );
}
