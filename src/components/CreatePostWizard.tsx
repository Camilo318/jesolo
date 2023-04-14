import { useUser } from "@clerk/nextjs";
import { Input } from "@mantine/core";
import { api } from "~/utils/api";

const CreatePostWizard = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const createPost = api.posts.create.useMutation();

  if (!isLoaded) return null;

  if (!isSignedIn) {
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
        label={<span className="text-indigo-600">Emoji</span>}
      >
        <Input
          placeholder="Your emoji here"
          id="emoji-input"
          className="mt-1"
          onKeyDown={(e) => {
            if (e.key !== "Enter") return;
            createPost.mutate({
              content: e.currentTarget.value,
            });
            e.currentTarget.value = "";
          }}
        />
      </Input.Wrapper>
    </div>
  );
};

export default CreatePostWizard;
