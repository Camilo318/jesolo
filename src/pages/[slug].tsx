import { Loader } from "@mantine/core";
import { type NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { api } from "~/utils/api";

const Profile: NextPage = () => {
  const router = useRouter();

  const { slug } = router.query;
  const { data, isLoading } = api.profiles.getProfile.useQuery(
    {
      username: slug as string,
    },
    {
      enabled: !!slug,
    }
  );
  if (isLoading) return <Loader />;
  if (!data) return <div>User not found</div>;

  return (
    <>
      <Head>
        <title>Username here</title>
      </Head>
      <div>
        <p>{data.username}</p>
        {data.firstName} {data.lastName}
      </div>
    </>
  );
};

export default Profile;
