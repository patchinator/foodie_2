import AuthForm from "../../components/auth/AuthForm";
import { Fragment } from "react";
import Head from "next/head";

const Login = () => {
  return (
  <Fragment>
    <Head>
      <title>Foodie | Login</title>
    </Head>
    <AuthForm />
  </Fragment>
  )
};

export default Login;
