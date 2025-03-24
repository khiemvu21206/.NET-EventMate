import EditUserProfile from "@/components/authen/userProfile/EditUserProfile"; // Adjust path to your component

interface UpdateUserProfilePageProps {
  params: {
    id: string;
  };
}

export default function UpdateUserProfilePage({ params }: UpdateUserProfilePageProps) {
  const { id } = params;

  return <EditUserProfile userId={id} />;
}

// Optional: Generate metadata for the page
export async function generateMetadata({ params }: UpdateUserProfilePageProps) {
  return {
    title: `Edit Profile - User ${params.id}`,
    description: "Update your user profile information",
  };
}