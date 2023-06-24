import { type NextPage } from "next";
import Head from "next/head";
import { Loader } from "@mantine/core";
import CreatePostWizard from "~/components/CreatePostWizard";
import SessionUI from "~/components/SessionUI";
import { api } from "~/utils/api";
import Container from "~/components/Container";
import PostView from "~/components/Post";

const Home: NextPage = () => {
  const {
    data,
    isLoading,
    refetch: refetchPosts,
  } = api.posts.getAll.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });
  return (
    <>
      <Head>
        <title>Jesolo</title>
        <meta name="description" content="Jesolo feed" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container>
        <section className="glass relative flex min-h-0 w-full max-w-3xl flex-grow flex-col gap-4 px-4 py-4 md:px-8">
          <SessionUI />
          {isLoading ? (
            <div className="absolute inset-0 flex h-full w-full items-center justify-center">
              <Loader color="indigo" />
            </div>
          ) : (
            <>
              <CreatePostWizard onSuccess={refetchPosts} />
              <div className="grid min-h-0 flex-1 grid-cols-1 justify-items-center gap-4 overflow-auto">
                {data?.map(({ post, author }) => (
                  <PostView key={post.id} author={author} post={post} />
                ))}
              </div>
            </>
          )}
        </section>
      </Container>
    </>
  );
};

export default Home;
