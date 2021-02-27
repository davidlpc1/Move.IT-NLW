import { ThemeProvider } from 'next-themes'
import "../styles/global.css";

export default function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
