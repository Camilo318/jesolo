import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";
import Link from "next/link";
import { Avatar } from "@mantine/core";
import type { RouterOutputs } from "~/utils/api";

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

type PostWithAuthor = RouterOutputs["posts"]["getAll"][number];
const PostView = (props: PostWithAuthor) => {
  const { author, post } = props;
  const timeAgo = dayjs(post.createdAt).fromNow(true);
  return (
    <div className="glass flex w-full items-start gap-2 rounded-xl px-3 py-3">
      <div>
        <Link href={`/${author?.username as string}`}>
          <div className="overflow-hidden rounded-full">
            <Avatar
              src={author?.profileImageUrl}
              radius="lg"
              alt="post's author profile picture"
            />
          </div>
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

export default PostView;
