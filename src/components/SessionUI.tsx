import { Button, Avatar } from "@mantine/core";
import { useRouter } from "next/router";

import { useAuth, SignedOut, SignedIn, useUser } from "@clerk/nextjs";

const SessionUI = () => {
  const router = useRouter();
  const { user } = useUser();
  const { signOut } = useAuth();
  return (
    <div className="flex justify-end">
      <SignedOut>
        <Button
          type="button"
          color="indigo"
          variant="subtle"
          onClick={() => {
            void router.push("/sign-in");
          }}
        >
          Sign in
        </Button>
      </SignedOut>

      <SignedIn>
        <div className="flex w-full items-center justify-between">
          {/* since we are signed in, user will not be undefined */}
          <div className="overflow-hidden rounded-full">
            <Avatar
              src={user?.profileImageUrl}
              radius="lg"
              alt={`${user?.username ?? "Your"} profile picture`}
            />
          </div>
          <Button
            color="indigo"
            variant="subtle"
            onClick={() => {
              void signOut();
            }}
          >
            Sign out
          </Button>
        </div>
      </SignedIn>
    </div>
  );
};

export default SessionUI;
