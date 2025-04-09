import { useUser as useClerkUser } from "@clerk/nextjs";

export const useUser = () => {
  const { user, isLoaded, isSignedIn } = useClerkUser();

  return {
    user,
    isLoaded,
    isSignedIn,
  };
}; 