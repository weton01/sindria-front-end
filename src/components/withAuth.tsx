import { useRouter } from "next/router";

const withAuth = (Component) => {
  const blackList = ["/login", "/signup"];
  const whiteList = ["/", "/login", "/signup"];

  const privateRoute = (route, token) => {
    return blackList.includes(route) === false && token !== null;
  };

  const publicRoute = (route, token) => {
    return whiteList.includes(route) === true && token === null;
  }; 

  const Auth = (props) => { 
    if (typeof window !== "undefined") {
      const router = useRouter();
      const token = localStorage.getItem("shop_token");

      console.log(publicRoute(props.router.asPath, token));
      if (privateRoute(props.router.asPath, token)) { 
        return <Component {...props} />;
      } else {
        if (publicRoute(props.router.asPath, token)) {
          return <Component {...props} />;
        } else {
          router.push("/");
        }
      }
    }
    return null;
  }; 

  if (Component.getInitialProps) {
    Auth.getInitialProps = Component.getInitialProps;
  }

  return Auth;
};

export default withAuth;
