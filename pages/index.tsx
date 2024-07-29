import LoginForm from "@/components/LoginForm";
import Navbar from "@/components/Navbar";
import Head from "next/head";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
      <Head>
        <title> Kothopokothon </title>
        <link rel="shortcut icon" href="favicon.png" type="image/png" />
      </Head>
      <div className={"min-h-screen " +inter.className}>
        <Navbar/>
        <div className="py-12 px-4">
          <LoginForm/>
        </div>
      </div>
    </>
  );
}
