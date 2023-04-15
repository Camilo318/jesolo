import { useUser } from "@clerk/nextjs";
import { TextInput } from "@mantine/core";
import { api } from "~/utils/api";

const CreatePostWizard = <T,>({ onSuccess }: { onSuccess: () => T }) => {
  const { isLoaded, isSignedIn, user } = useUser();
  const createPost = api.posts.create.useMutation({
    onSuccess: () => onSuccess(),
  });

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

      <TextInput
        id="emoji-input"
        label={<span className="text-indigo-600">Emoji</span>}
        placeholder="Your emoji here"
        className="mt-1"
        onKeyDown={(e) => {
          if (e.key !== "Enter") return;
          createPost.mutate({
            content: e.currentTarget.value,
          });
          e.currentTarget.value = "";
        }}
        disabled={createPost.isLoading}
      />
    </div>
  );
};

export default CreatePostWizard;
