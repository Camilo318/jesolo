// import { Loader } from "@mantine/core";
import type { GetStaticPropsContext, InferGetStaticPropsType } from "next";
import Head from "next/head";
import { Avatar, Loader } from "@mantine/core";
import Container from "~/components/Container";
import { api } from "~/utils/api";
import PostView from "~/components/Post";
import { type ReactNode } from "react";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";

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

  const { data: postsWithUser, isLoading } =
    api.posts.getPostsByUserId.useQuery(
      {
        userId: userData?.id as string,
      },
      {
        refetchOnWindowFocus: false,
      }
    );

  if (!userData) return <div>User not found</div>;

  return (
    <>
      <Head>
        <title>{userData.username}</title>
      </Head>
      <div className="glass absolute inset-x-0 top-0 -z-10 h-20"></div>
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
          {postsWithUser?.map((data) => (
            <PostView key={data.post.id} author={userData} post={data.post} />
          ))}
        </ProfileFeed>
      </Container>
    </>
  );
};

const ProfileFeed = ({ children }: { children: ReactNode }) => {
  return (
    <div className="grid min-h-0 w-full max-w-3xl flex-1 grid-cols-1 justify-items-center gap-4 overflow-auto pr-5">
      {children}
    </div>
  );
};

export async function getStaticProps(
  context: GetStaticPropsContext<{ slug: string }>
) {
  /* 
    we are not pre-rendering any static pages at build time
    so this function will be called before initial render
   */

  const ssg = generateSSGHelper();
  const slug = context.params?.slug as string;

  if (typeof slug !== "string") throw new Error("no slug");

  // prefetch user
  await ssg.profiles.getProfile.prefetch({
    username: slug,
  });
  return {
    props: {
      trpcState: ssg.dehydrate(),
      username: slug,
    },
  };
}

export const getStaticPaths = () => {
  // we don't pre-render any paths at build time
  // we defer generating all pages on-demand by returning an empty array for paths
  return { paths: [], fallback: "blocking" };
  // will server-render pages on-demand if the path doesn't exist
  // future requests will serve the static file from the cache
};

export default Profile;
