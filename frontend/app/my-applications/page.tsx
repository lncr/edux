"use client"
import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getApplications, Application } from "@/lib/data/applications"
import { FileText, Calendar, GraduationCap, Plus, Loader2 } from "lucide-react"
import apiClient from "@/lib/api" // make sure this import path matches your project

export default function MyApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [showRecommendForm, setShowRecommendForm] = useState(false);
  const [interestedIn, setInterestedIn] = useState("");
  const [goodAt, setGoodAt] = useState("");
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const data = await getApplications();
        setApplications(data);
      } catch (e) {
        console.error("Failed to load applications:", e);
      }
    })();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Accepted":
      case "ACCEPTED":
        return "bg-green-500"
      case "Rejected":
        return "bg-red-500"
      case "Under Review":
      case "UNDER REVIEW":
        return "bg-yellow-500"
      case "Waitlisted":
        return "bg-orange-500"
      default:
        return "bg-blue-500"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setRecommendations([]);

    try {
      const response = await apiClient.post("/v1/recommend/", {
        interested_in: interestedIn,
        good_at: goodAt,
      });
      setRecommendations(response); // backend should return array of strings
    } catch (error) {
      console.error("Failed to get recommendations:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                My <span className="text-primary">Applications</span>
              </h1>
              <p className="text-xl text-muted-foreground">Track the status of your university applications.</p>
            </div>
            <div className="flex flex-col gap-2 md:flex-row">
              <Button asChild className="mt-4 md:mt-0">
                <Link href="/apply">
                  <Plus className="h-4 w-4 mr-2" />
                  New Application
                </Link>
              </Button>
              <Button
                variant="secondary"
                className="mt-2 md:mt-0"
                onClick={() => setShowRecommendForm(!showRecommendForm)}
              >
                Recommend me an academic path
              </Button>
            </div>
          </div>

          {/* Recommend Form */}
          {showRecommendForm && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Get Academic Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block mb-1 font-medium">
                      Tell me what are you interested in the most?
                    </label>
                    <input
                      type="text"
                      value={interestedIn}
                      onChange={(e) => setInterestedIn(e.target.value)}
                      placeholder="I'm interested in ..."
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">
                      Tell me what you think you are good at?
                    </label>
                    <input
                      type="text"
                      value={goodAt}
                      onChange={(e) => setGoodAt(e.target.value)}
                      placeholder="I think I'm good at ..."
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  <Button type="submit" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      "Recommend"
                    )}
                  </Button>
                </form>

                {/* Recommendations */}
                {recommendations.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2">Recommended paths:</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {recommendations.map((rec, idx) => (
                        <li key={idx} className="text-muted-foreground">
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Applications List */}
          {applications.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <CardTitle className="mb-2">No Applications Yet</CardTitle>
                <CardDescription className="mb-6">
                  You haven't submitted any applications yet. Start your journey by applying to your dream university.
                </CardDescription>
                <Button asChild>
                  <Link href="/universities">Browse Universities</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {applications.map((application) => (
                <Card key={application.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div className="flex items-center gap-3 mb-2 md:mb-0">
                        <GraduationCap className="h-6 w-6 text-primary" />
                        <div>
                          <CardTitle className="text-xl">{application.university_name}</CardTitle>
                          <CardDescription>{application.targetProgram} Program</CardDescription>
                        </div>
                      </div>
                      <Badge className={`${getStatusColor(application.status)} text-white`}>
                        {application.status}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Submitted: {formatDate(application.created_at)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <GraduationCap className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Target: Education Program</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Education: {application.prior_highest_education}</span>
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/my-applications/${application.id}`}>View Details</Link>
                      </Button>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/universities/${application.university}`}>View University</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Summary Stats */}
          {applications.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-primary">{applications.length}</p>
                  <p className="text-sm text-muted-foreground">Total Applications</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-yellow-600">
                    {applications.filter((app) => app.status === "UNDER REVIEW").length}
                  </p>
                  <p className="text-sm text-muted-foreground">Under Review</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {applications.filter((app) => app.status === "ACCEPTED").length}
                  </p>
                  <p className="text-sm text-muted-foreground">Accepted</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-blue-600">
                    {applications.filter((app) => app.status === "SUBMITTED").length}
                  </p>
                  <p className="text-sm text-muted-foreground">Submitted</p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
