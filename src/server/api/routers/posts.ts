import { z } from "zod";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import type { User } from "@clerk/nextjs/dist/api";
import { clerkClient } from "@clerk/nextjs/server";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";

type AuthorMap = Record<
  string,
  Pick<User, "id" | "username" | "profileImageUrl" | "firstName">
>;

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, "1 m"),
  analytics: true,
});

export const postsRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const posts = await ctx.prisma.post.findMany({
      take: 100,
      orderBy: {
        createdAt: "desc",
      },
    });

    const users = await clerkClient.users.getUserList({
      limit: 100,
      userId: posts.map((post) => post.authorId),
    });

    const usersMap = users.reduce((acc: AuthorMap, cu) => {
      acc[cu.id] = {
        id: cu.id,
        username: cu.username,
        firstName: cu.firstName,
        profileImageUrl: cu.profileImageUrl,
      };
      return acc;
    }, {});

    return posts.map((post) => {
      return {
        post,
        author: usersMap[post.authorId],
      };
    });
  }),

  create: protectedProcedure
    .input(z.object({ content: z.string().emoji().min(1).max(280) }))
    .mutation(async ({ ctx, input }) => {
      const { success } = await ratelimit.limit(ctx.auth.userId);

      if (!success) {
        throw new TRPCError({ code: "TOO_MANY_REQUESTS" });
      }

      return ctx.prisma.post.create({
        data: {
          content: input.content,
          authorId: ctx.auth.userId,
        },
      });
    }),
});
