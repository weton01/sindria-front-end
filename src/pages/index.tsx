import Section13 from "@component/home-1/Section13";
import Section1 from "../components/home-1/Section1";
import Section10 from "../components/home-1/Section10";
import Section11 from "../components/home-1/Section11";
import Section12 from "../components/home-1/Section12";
import Section2 from "../components/home-1/Section2";
import Section3 from "../components/home-1/Section3";
import Section4 from "../components/home-1/Section4";
import Section5 from "../components/home-1/Section5";
import Section6 from "../components/home-1/Section6";
import Section7 from "../components/home-1/Section7";
import Section8 from "../components/home-1/Section8";
import Section9 from "../components/home-1/Section9";
import AppLayout from "../components/layout/AppLayout";
import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";
import jwt from 'jsonwebtoken'

const IndexPage = () => {
  return (
    <main>
      <Section1 />
      <Section2 />
      <Section3 />
      <Section4 />
      <Section5 />
      <Section13 />
      <Section6 />
      <Section7 />
      <Section8 />
      <Section9 />
      <Section10 />
      <Section11 />
      <Section12 />
    </main>
  );
};

export const getServerSideProps: GetServerSideProps  = async (ctx) => {
  const { ['sindria-auth-token'] : token   } = parseCookies(ctx)
 
  try{
    if(token)
    return {
      props: {
        user: {
          ...jwt.verify(token, "Dragonite1@"),
          token
        }
      }
    }
  } catch (err) { 
    
  }
  

  return { 
    props: {}
  }
}

IndexPage.layout = AppLayout;

export default IndexPage;
