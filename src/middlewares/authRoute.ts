import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";

export const authRoute = (ctx, fnc : GetServerSideProps) => {
  const { ["shop_token"]: token } = parseCookies(ctx);

  if (!token) {
    return {
      redirect: {
        permanent: false,
        destination: "/login"
      }
    }
  } else {
    ctx.token = token;
    return fnc(ctx)
  }
}