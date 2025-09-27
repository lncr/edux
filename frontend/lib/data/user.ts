import { apiClient} from "@/lib/api"
export interface User {
  id: string
  first_name: string
  last_name: string
  email: string
  profile: {
    bio: string
    avatar: string | null
  }
}


export async function getCurrentUser(): Promise<User> {
  try {
    const user = await apiClient.getUserProfile();
    return user as User;
  } catch (error) {
    console.error("Failed to fetch current user:", error);
    throw error;
  }
}

export async function updateUser(updates: Partial<User>): Promise<User> {
  try {
    const response = await apiClient.requestFormData("/v1/user/profile/", {
      method: "PATCH",
      body: updates,
    });

    if (!response.ok) {
      throw new Error("Failed to update user profile");
    }

    const updatedUser = await response.json();
    return updatedUser as User;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
}
