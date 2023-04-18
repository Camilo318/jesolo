import type { User } from "@clerk/nextjs/dist/api";

export const filterUseForClient = (user: User) => {
  if (!user) {
    throw new Error("No user provided");
  }
  return {
    id: user.id,
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    profileImageUrl: user.profileImageUrl,
  };
};

export type filteredUser = ReturnType<typeof filterUseForClient>;
