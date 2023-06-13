import { SignIn } from "@clerk/nextjs";
import Head from "next/head";
import Container from "~/components/Container";

const SignInPage = () => (
  <>
    <Head>
      <title>Sign in | Jesolo</title>
    </Head>
    <Container>
      <SignIn
        path="/sign-in"
        routing="path"
        signUpUrl="/sign-up"
        redirectUrl="/"
      />
    </Container>
  </>
);
export default SignInPage;
