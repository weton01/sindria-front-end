import { useRouter } from "next/router";

const withAuth = (Component) => {
  const blackList = [
    "login",
    "signup",
    "recover-password",
    "recover-password-callback",
    "code-user",
  ];
  const whiteList = [
    "",
    "404",
    "login",
    "signup",
    "recover-password",
    "recover-password-callback",
    "mail",
    "code-user",
    "product",
    "cart"
  ];

  const privateRoute = (route, token) => {
    return (
      blackList.findIndex((item) => route === item) === -1 && token !== null
    );
  };

  const publicRoute = (route, token) => {
    return (
      whiteList.findIndex((item) => route === item) !== -1 && token === null
    );
  };

  const Auth = (props) => {
    if (typeof window !== "undefined") {
      const router = useRouter();
      const token = localStorage.getItem("shop_token");
      const route = props.router.asPath.split("/")[1];

      if (privateRoute(route, token)) {
        return <Component {...props} />;
      } else {
        if (publicRoute(route, token)) 
          return <Component {...props} />;
        router.push("/");
      }
    }
    return <Component {...props} />;
  };

  if (Component.getInitialProps) {
    Auth.getInitialProps = Component.getInitialProps;
  }

  return Auth;
};

export default withAuth;
