import { useUser } from "@clerk/nextjs";
import { Input } from "@mantine/core";

const CreatePostWizard = () => {
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded || !isSignedIn) {
    return (
      <p className="text-center text-base tracking-wide text-slate-700">
        Sign in to start posting emojis
      </p>
    );
  }

  return (
    <div className="space-y-4 text-slate-700">
      <p className="text-center text-base tracking-wide">
        Hi {user.username}! time to post some emojis 😏
      </p>

      <Input.Wrapper
        id="emoji-input"
        label={<span className="text-indigo-600">Type an emoji</span>}
      >
        <Input
          placeholder="Your emoji here"
          id="emoji-input"
          className="mt-1"
        />
      </Input.Wrapper>
    </div>
  );
};

export default CreatePostWizard;
