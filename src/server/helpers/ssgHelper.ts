import { createServerSideHelpers } from "@trpc/react-query/server";
import { appRouter } from "~/server/api/root";
import { type AuthContext } from "../api/trpc";
import { createInnerTRPCContext } from "../api/trpc";
import superjson from "superjson";

export const generateSSGHelper = () => {
  const helper = createServerSideHelpers({
    router: appRouter,
    // hacky way to have a context without auth
    ctx: createInnerTRPCContext({} as AuthContext),
    transformer: superjson, // optional - adds superjson serialization
  });
  return helper;
};
