// import { Loader } from "@mantine/core";
import type { GetStaticPropsContext, InferGetStaticPropsType } from "next";
import { createServerSideHelpers } from "@trpc/react-query/server";
import Head from "next/head";
import superjson from "superjson";
import { appRouter } from "~/server/api/root";
import { type AuthContext, createInnerTRPCContext } from "~/server/api/trpc";
import { api } from "~/utils/api";

const Profile = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { username } = props;

  const { data, isLoading } = api.profiles.getProfile.useQuery(
    {
      username,
    },
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );
  if (isLoading) {
    return <div>loading?</div>;
  }
  if (!data) return <div>User not found</div>;

  return (
    <>
      <Head>
        <title>{data.username}</title>
      </Head>
      <div>
        <p>{data.username}</p>
        {data.firstName} {data.lastName}
      </div>
    </>
  );
};

export async function getStaticProps(
  context: GetStaticPropsContext<{ slug: string }>
) {
  const helpers = createServerSideHelpers({
    router: appRouter,
    // hacky way to have a context without auth
    ctx: createInnerTRPCContext({} as AuthContext),
    transformer: superjson, // optional - adds superjson serialization
  });
  const slug = context.params?.slug as string;
  // prefetch user
  await helpers.profiles.getProfile.prefetch({
    username: slug,
  });
  return {
    props: {
      trpcState: helpers.dehydrate(),
      username: slug,
    },
  };
}

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

export default Profile;
