import { z } from "zod";

import type { User } from "@clerk/nextjs/dist/api";
import { clerkClient } from "@clerk/nextjs/server";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

type AuthorMap = Record<
  string,
  Pick<User, "id" | "username" | "profileImageUrl" | "firstName">
>;

export const postsRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const posts = await ctx.prisma.post.findMany({
      take: 100,
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
    .mutation(({ ctx, input }) => {
      return ctx.prisma.post.create({
        data: {
          content: input.content,
          authorId: ctx.userId,
        },
      });
    }),
});
