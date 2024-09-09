import { useAuth } from "@clerk/clerk-react";

// Function to get config with token
export const getConfig = async () => {
  const { getToken } = useAuth();
  const token = await getToken();
  console.log(token);

  return {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
};
