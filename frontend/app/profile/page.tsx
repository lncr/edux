"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getCurrentUser, updateUser, User } from "@/lib/data/user"
import { getApplicationsByUser } from "@/lib/data/applications"
import { Edit3, Save, X, Calendar, FileText, GraduationCap } from "lucide-react"

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [applications, setApplications] = useState([])
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    profile: {
      bio: "",
      avatar: ""
    }
  })
  useEffect(() => {
  const fetchData = async () => {
    setLoading(true);
    try {
      const currentUser = await getCurrentUser();
      const apps = await getApplicationsByUser();
      console.log(currentUser)
      setUser(currentUser);
      setApplications(apps);
      setFormData({
          first_name: currentUser.first_name,
          last_name: currentUser.last_name,
          email: currentUser.email,
          profile: {
            bio: currentUser.profile.bio,
            avatar: currentUser.profile.avatar
          }
        })
    } catch (err) {
      console.error("Failed to load profile data:", err);
    } finally {
      setLoading(false);
    }
  };
      fetchData();
    }, []);

  const handleSave = async () => {
    setLoading(true)

    const formDataToSend = new FormData()
    if (formData.first_name){
      formDataToSend.append("first_name", formData.first_name)
    }
    if (formData.last_name){
      formDataToSend.append("last_name", formData.last_name)
  }
    if (formData.email){
      formDataToSend.append("email", formData.email)
    }
    if (formData.profile?.bio) {
      formDataToSend.append("profile.bio", formData.profile.bio)
    }
    if (formData.profile?.avatar) {
      formDataToSend.append("profile.avatar", formData.profile.avatar) // must be a File
    }
    try {
        const updated = await updateUser(formDataToSend);
        console.log("Updated user:", updated);
        setUser(updated);
      } catch (e) {
    alert("Failed to update profile");
  }
    setLoading(false)
  }

  const handleCancel = () => {
    setFormData({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      profile: {
        bio: user.profile.bio,
        avatar: user?.profile.avatar
      }
    })
    setIsEditing(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  const { name, type } = e.target

    // Special case for file inputs
    if (type === "file" && e.target instanceof HTMLInputElement) {
      const file = e.target.files?.[0]
      if (!file) return

      setFormData((prev) => ({
        ...prev,
        profile: {
          ...prev.profile,
          [name]: file, // store the File object
        },
      }))
      return
    }

    const value = e.target.value

    setFormData((prev) => {
      if (name === "bio" || name === "avatar") {
        return {
          ...prev,
          profile: {
            ...prev.profile,
            [name]: value,
          },
        }
      }

      return {
        ...prev,
        [name]: value,
      }
    })
  }


  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-muted-foreground">Loading…</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              My <span className="text-primary">Profile</span>
            </h1>
            <p className="text-xl text-muted-foreground">Manage your account information and preferences.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Profile Card */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Profile Information</CardTitle>
                    {!isEditing ? (
                      <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
                        <Edit3 className="h-4 w-4 mr-2" />
                        Edit Profile
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button onClick={handleSave} size="sm" disabled={isLoading}>
                          <Save className="h-4 w-4 mr-2" />
                          {isLoading ? "Saving..." : "Save"}
                        </Button>
                        <Button onClick={handleCancel} variant="outline" size="sm">
                          <X className="h-4 w-4 mr-2" />
                          Cancel
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Avatar Section */}
                <div className="flex items-center gap-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage
                      src={
                        formData.profile.avatar || "/placeholder.svg"
                      }
                      alt={`${user?.first_name} ${user?.last_name}`}
                    />
                    <AvatarFallback className="text-lg">
                      {user?.first_name[0]}
                      {user?.last_name[0]}
                    </AvatarFallback>
                  </Avatar>

                  {isEditing && (
                    <div>
                      <input
                        type="file"
                        id="avatar"
                        name="avatar"
                        accept="image/*"
                        className="hidden"
                        onChange={handleChange}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById("avatar")?.click()}
                      >
                        Change Avatar
                      </Button>
                      <p className="text-xs text-muted-foreground mt-1">
                        JPG, PNG or GIF. Max size 2MB.
                      </p>
                    </div>
                  )}
                </div>

                  {/* Form Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="first_name">First Name</Label>
                      {isEditing ? (
                        <Input id="first_name" name="first_name" value={formData.first_name} onChange={handleChange} />
                      ) : (
                        <p className="py-2 px-3 bg-muted/50 rounded-md">{user.first_name}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="last_name">Last Name</Label>
                      {isEditing ? (
                        <Input id="last_name" name="last_name" value={formData.last_name} onChange={handleChange} />
                      ) : (
                        <p className="py-2 px-3 bg-muted/50 rounded-md">{user.last_name}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    {isEditing ? (
                      <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} />
                    ) : (
                      <p className="py-2 px-3 bg-muted/50 rounded-md">{user.email}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    {isEditing ? (
                      <Textarea
                        id="bio"
                        name="bio"
                        value={formData.profile.bio}
                        onChange={handleChange}
                        className="min-h-24"
                        placeholder="Tell us about yourself..."
                      />
                    ) : (
                      <p className="py-2 px-3 bg-muted/50 rounded-md min-h-24 whitespace-pre-wrap">
                        {user.profile.bio || "No bio provided."}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Account Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Account Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Member since</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Applications</span>
                    </div>
                    <span className="text-sm font-medium">{applications.length}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Universities</span>
                    </div>
                    <span className="text-sm font-medium">
                      {new Set(applications.map((app) => app.universityId)).size}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Applications */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Applications</CardTitle>
                  <CardDescription>Your latest university applications</CardDescription>
                </CardHeader>
                <CardContent>
                  {applications.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">No applications yet</p>
                  ) : (
                    <div className="space-y-3">
                      {applications.slice(0, 3).map((application) => (
                        <div
                          key={application.id}
                          className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                        >
                          <div>
                            <p className="text-sm font-medium">{application.universityName}</p>
                            <p className="text-xs text-muted-foreground">{application.targetProgram}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-muted-foreground">{application.status}</p>
                          </div>
                        </div>
                      ))}
                      {applications.length > 3 && (
                        <Button variant="ghost" size="sm" className="w-full" asChild>
                          <a href="/my-applications">View All Applications</a>
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Account Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                    Change Password
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                    Privacy Settings
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                    Notification Preferences
                  </Button>
                  <Button variant="destructive" size="sm" className="w-full justify-start">
                    Delete Account
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
