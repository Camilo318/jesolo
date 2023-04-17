import { z } from "zod";
// import type { User } from "@clerk/nextjs/dist/api";
import { clerkClient } from "@clerk/nextjs/server";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const profilesRouter = createTRPCRouter({
  //get user by username
  getProfile: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ input }) => {
      console.log(input.username);
      const [user] = await clerkClient.users.getUserList({
        username: [input.username],
      });

      if (!user) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "User not found",
        });
      }

      const {
        username,
        emailAddresses,
        firstName,
        lastName,
        profileImageUrl,
        createdAt,
      } = user;

      return {
        username,
        emailAddresses,
        firstName,
        lastName,
        profileImageUrl,
        createdAt,
      };
    }),
});
