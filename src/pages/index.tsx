import { type NextPage } from "next";
import Head from "next/head";
import { Avatar, Loader } from "@mantine/core";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";

import CreatePostWizard from "~/components/CreatePostWizard";
import SessionUI from "~/components/SessionUI";
import { type RouterOutputs, api } from "~/utils/api";
import Link from "next/link";

dayjs.extend(relativeTime);
dayjs.extend(updateLocale);

dayjs.updateLocale("en", {
  relativeTime: {
    future: "in %s",
    past: "%s ago",
    s: "%ds",
    m: "1m",
    mm: "%dm",
    h: "1h",
    hh: "%dh",
    d: "1d",
    dd: "%dd",
    M: "1m",
    MM: "%dm",
    y: "1y",
    yy: "%dy",
  },
});

const Home: NextPage = () => {
  const {
    data,
    isLoading,
    refetch: refetchPosts,
  } = api.posts.getAll.useQuery();
  return (
    <>
      <Head>
        <title>Jesolo</title>
        <meta name="description" content="Jesolo feed" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-col items-center bg-gradient-to-tr from-[#8EC5FC] to-[#E0C3FC]">
        <div className="container relative flex min-h-screen flex-col items-center gap-12 px-4 py-16">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            <span className="inline-block text-violet-600">Jesolo</span> App
          </h1>

          <section className="glass relative w-full max-w-3xl flex-grow space-y-4 rounded-xl px-8 py-4">
            {isLoading ? (
              <div className="absolute inset-0 flex h-full w-full items-center justify-center">
                <Loader color="indigo" />
              </div>
            ) : (
              <>
                <SessionUI />
                <CreatePostWizard onSuccess={refetchPosts} />
                <div className="grid grid-cols-1 justify-items-center gap-4">
                  {data?.map(({ post, author }) => (
                    <PostView key={post.id} author={author} post={post} />
                  ))}
                </div>
              </>
            )}
          </section>
        </div>
      </main>
    </>
  );
};

type PostWithAuthor = RouterOutputs["posts"]["getAll"][number];
const PostView = (props: PostWithAuthor) => {
  const { author, post } = props;
  const timeAgo = dayjs(post.createdAt).fromNow(true);
  return (
    <div className="glass flex w-full items-start gap-2 rounded-xl px-4 py-4">
      <div>
        <Link href={`/${author?.username as string}`}>
          <Avatar
            src={author?.profileImageUrl}
            radius="lg"
            alt="post's author profile picture"
          />
        </Link>
      </div>
      <div className="flex-1">
        <Link href={`/post/${post.id}`}>
          <div>
            <span className="font-bold text-indigo-800">
              {author?.firstName}
            </span>
            <> </>
            <span className="font-light text-slate-600">
              @{author?.username}
            </span>
            <span className="text-slate-600"> · </span>
            <span className="font-light text-slate-600">{timeAgo}</span>
          </div>
          <p>{post.content}</p>
        </Link>
      </div>
    </div>
  );
};

export default Home;
