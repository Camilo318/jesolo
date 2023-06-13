import { SignUp } from "@clerk/nextjs";
import Head from "next/head";
import Container from "~/components/Container";

const SignUpPage = () => (
  <>
    <Head>
      <title>Sign up | Jesolo</title>
    </Head>
    <Container>
      <SignUp
        path="/sign-up"
        routing="path"
        signInUrl="/sign-in"
        redirectUrl="/"
      />
    </Container>
  </>
);
export default SignUpPage;
