import { useUser } from "@clerk/nextjs";
import { Loader, TextInput } from "@mantine/core";
import { toast } from "react-hot-toast";
import { api } from "~/utils/api";

const CreatePostWizard = <T,>({ onSuccess }: { onSuccess: () => T }) => {
  const { isLoaded, isSignedIn } = useUser();
  const createPost = api.posts.create.useMutation({
    onSuccess: () => {
      toast.success("Emoji succesfully posted!");
      onSuccess();
    },
    onError: (e) => {
      // fieldErrors is a map where keys are the input params ("content" in our case) and the values are arrays with the error messages
      const errors = e.data?.zodError?.fieldErrors.content ?? [];

      errors?.forEach((error) => {
        toast.error(error, {
          position: "bottom-center",
        });
      });
    },
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
        rightSection={
          <Loader
            size="xs"
            style={{ visibility: createPost.isLoading ? "visible" : "hidden" }}
          />
        }
      />
    </div>
  );
};

export default CreatePostWizard;
