import type { InferGetStaticPropsType, GetStaticPropsContext } from "next";
import Container from "~/components/Container";
import { api } from "~/utils/api";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";
import Head from "next/head";
import PostView from "~/components/Post";

const Tweet = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { id } = props;
  const { data, isLoading } = api.posts.getById.useQuery(
    { id },
    {
      refetchOnWindowFocus: false,
    }
  );

  if (isLoading) {
    console.log("Loading!!");
  }

  if (!data) return <div>404</div>;
  return (
    <>
      <Head>
        <title>{`${data?.post.content} - ${
          data?.author.username as string
        }`}</title>
      </Head>
      <Container>
        <PostView post={data.post} author={data.author} />
      </Container>
    </>
  );
};

export default Tweet;

export async function getStaticProps(
  context: GetStaticPropsContext<{ id: string }>
) {
  const ssg = generateSSGHelper();
  const postId = context.params?.id as string;
  // prefetch user
  await ssg.posts.getById.prefetch({ id: postId });
  return {
    props: {
      trpcState: ssg.dehydrate(),
      id: postId,
    },
  };
}

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};
