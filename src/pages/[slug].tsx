// import { Loader } from "@mantine/core";
import type { GetStaticPropsContext, InferGetStaticPropsType } from "next";
import { createServerSideHelpers } from "@trpc/react-query/server";
import Head from "next/head";
import superjson from "superjson";
import { Avatar, Loader } from "@mantine/core";
import { appRouter } from "~/server/api/root";
import { type AuthContext, createInnerTRPCContext } from "~/server/api/trpc";
import Container from "~/components/Container";
import { api } from "~/utils/api";
import PostView from "~/components/Post";
import { type ReactNode } from "react";

const Profile = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { username } = props;

  const { data: userData } = api.profiles.getProfile.useQuery(
    {
      username,
    },
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );

  const { data: userPosts, isLoading } = api.posts.getPostByUserId.useQuery({
    userId: userData?.id as string,
  });

  if (!userData) return <div>User not found</div>;

  return (
    <>
      <Head>
        <title>{userData.username}</title>
      </Head>
      <div className="glass absolute inset-x-0 top-0 -z-10 h-[110px]"></div>
      <Container>
        <div className="overflow-hidden rounded-full border-4 border-white/60 bg-indigo-400 bg-clip-border shadow-sm">
          <Avatar size="xl" src={userData.profileImageUrl} />
        </div>
        <p className="text-indigo-900">
          <span className="text-lg font-semibold">{userData.firstName}</span>
          <> </>
          <span className="font-light">@{userData.username}</span>
        </p>
        <ProfileFeed>
          {isLoading && <Loader />}
          {userPosts?.map((post) => (
            <PostView key={post.id} author={userData} post={post} />
          ))}
        </ProfileFeed>
      </Container>
    </>
  );
};

const ProfileFeed = ({ children }: { children: ReactNode }) => {
  return (
    <div className="grid w-full max-w-3xl grid-cols-1 justify-items-center gap-4">
      {children}
    </div>
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
