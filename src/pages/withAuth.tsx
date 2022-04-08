import { useRouter } from "next/router";

const withAuth = (Component) => {
  const privateRoute = (route, token) => {
    return route.includes("auth") && token !== undefined;
  };

  const publicRoute = (route, token) => {
    return route.includes("auth") === false;
  };

  const withPrivateAuthenticationRoute = (route, token) => {
    const block = ["/login", "/signup"]; 
    return block.includes(route) && (token !== undefined && token !== null);
  };

  const Auth = (props) => { 
    if (typeof window !== "undefined") {
      const router = useRouter();
      const token = localStorage.getItem("shop_token");
      console.log(token);
 
      if (privateRoute(props.router.asPath, token)) {
        return <Component {...props} />;
      } else {
        if (withPrivateAuthenticationRoute(props.router.asPath, token)) {
          router.push("/");
        } else {
          if (publicRoute(props.router.asPath, token)) {
            return <Component {...props} />;
          } else {
            router.push("/");
          }
        }
      }
    }
    return <Component {...props} />;
  };
  // Copy getInitial props so it will run as well
  if (Component.getInitialProps) {
    Auth.getInitialProps = Component.getInitialProps;
  }

  return Auth;
};

export default withAuth;
