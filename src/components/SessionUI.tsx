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
          color="violet"
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
          <Avatar src={user?.profileImageUrl} radius="lg" />
          <Button
            color="violet"
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
