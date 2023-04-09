import { Button } from "@mantine/core";
import { useRouter } from "next/router";

import { useAuth, SignedOut, SignedIn } from "@clerk/nextjs";

const SessionUI = () => {
  const router = useRouter();
  const { signOut } = useAuth();
  return (
    <div className="flex justify-end">
      <SignedOut>
        <Button
          type="button"
          color="indigo"
          onClick={() => {
            void router.push("/sign-in");
          }}
        >
          Sign in
        </Button>
      </SignedOut>

      <SignedIn>
        <Button
          onClick={() => {
            void signOut();
          }}
        >
          Sign out
        </Button>
      </SignedIn>
    </div>
  );
};

export default SessionUI;
