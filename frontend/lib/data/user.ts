export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  bio: string
  avatar?: string
  joinedDate: string
}

// Mock user data
export const currentUser: User = {
  id: "1",
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  bio: "Passionate student pursuing higher education in computer science. Interested in artificial intelligence and machine learning.",
  avatar: "/placeholder.svg?height=150&width=150",
  joinedDate: "2024-01-01",
}

export function getCurrentUser(): User {
  return currentUser
}

export function updateUser(updates: Partial<User>): User {
  // In a real app, this would make an API call
  Object.assign(currentUser, updates)
  return currentUser
}
