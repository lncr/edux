"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getApplicationsByUser } from "@/lib/data/applications"
import { FileText, Calendar, GraduationCap, Plus } from "lucide-react"

export default function MyApplicationsPage() {
  const applications = getApplicationsByUser()

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Accepted":
        return "bg-green-500"
      case "Rejected":
        return "bg-red-500"
      case "Under Review":
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
            <Button asChild className="mt-4 md:mt-0">
              <Link href="/apply">
                <Plus className="h-4 w-4 mr-2" />
                New Application
              </Link>
            </Button>
          </div>

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
                          <CardTitle className="text-xl">{application.universityName}</CardTitle>
                          <CardDescription>{application.targetProgram} Program</CardDescription>
                        </div>
                      </div>
                      <Badge className={`${getStatusColor(application.status)} text-white`}>{application.status}</Badge>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Submitted: {formatDate(application.dateSubmitted)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <GraduationCap className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Target: {application.targetProgram}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Education: {application.highestEducation}</span>
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/my-applications/${application.id}`}>View Details</Link>
                      </Button>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/universities/${application.universityId}`}>View University</Link>
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
                    {applications.filter((app) => app.status === "Under Review").length}
                  </p>
                  <p className="text-sm text-muted-foreground">Under Review</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {applications.filter((app) => app.status === "Accepted").length}
                  </p>
                  <p className="text-sm text-muted-foreground">Accepted</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-blue-600">
                    {applications.filter((app) => app.status === "Submitted").length}
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
