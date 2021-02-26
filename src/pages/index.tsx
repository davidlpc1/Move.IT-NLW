import Head from "next/head";
import { motion } from "framer-motion";
import Link from "../components/Link";

export default function Home() {
  const motionProps = {
    variants: {
      show: { opacity: 1, y: "0" },
      hidden: { opacity: 0, y: "100%" },
    },
    initial: "hidden",
    animate: "show",
  };

  return (
    <div>
      <Link href="/cycle">Entrar</Link>
    </div>
  );
}
