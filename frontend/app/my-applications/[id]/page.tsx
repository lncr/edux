"use client"

import type React from "react"

import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getApplicationById } from "@/lib/data/applications"
import { getUniversityById } from "@/lib/data/universities"
import { ArrowLeft, FileText, Download } from "lucide-react"

interface ApplicationDetailPageProps {
  params: {
    id: string
  }
}

export default function ApplicationDetailPage({ params }: ApplicationDetailPageProps) {
  const application = getApplicationById(params.id)
  const university = application ? getUniversityById(application.universityId) : null

  if (!application || !university) {
    notFound()
  }

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
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Back Button */}
          <Button variant="ghost" asChild className="mb-6">
            <Link href="/my-applications">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Applications
            </Link>
          </Button>

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Application Details</h1>
              <p className="text-xl text-muted-foreground">{university.name}</p>
            </div>
            <Badge className={`${getStatusColor(application.status)} text-white text-lg px-4 py-2`}>
              {application.status}
            </Badge>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* University Info */}
              <Card>
                <CardHeader>
                  <CardTitle>University Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <img
                      src={university.thumbnail || "/placeholder.svg"}
                      alt={university.name}
                      className="w-16 h-16 rounded object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-lg">{university.name}</h3>
                      <p className="text-muted-foreground">{university.location}</p>
                      <p className="text-sm text-muted-foreground">
                        Established {university.established} • {university.students.toLocaleString()} students
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Application Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Application Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Target Program</Label>
                      <p className="font-medium">{application.targetProgram}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Highest Education</Label>
                      <p className="font-medium">{application.highestEducation}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Date Submitted</Label>
                      <p className="font-medium">{formatDate(application.dateSubmitted)}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Application Status</Label>
                      <p className="font-medium">{application.status}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Personal Statement */}
              <Card>
                <CardHeader>
                  <CardTitle>Personal Statement</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none">
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{application.essay}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full bg-transparent" asChild>
                    <Link href={`/universities/${university.id}`}>View University</Link>
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent">
                    Contact Admissions
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent">
                    Download Application
                  </Button>
                </CardContent>
              </Card>

              {/* Documents */}
              <Card>
                <CardHeader>
                  <CardTitle>Submitted Documents</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {application.recommendationLetter && (
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <span className="text-sm">Recommendation Letter</span>
                      </div>
                      <Button size="sm" variant="ghost">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                  {application.educationDocument && (
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <span className="text-sm">Education Document</span>
                      </div>
                      <Button size="sm" variant="ghost">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle>Application Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      <div>
                        <p className="text-sm font-medium">Application Submitted</p>
                        <p className="text-xs text-muted-foreground">{formatDate(application.dateSubmitted)}</p>
                      </div>
                    </div>
                    {application.status !== "Submitted" && (
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                        <div>
                          <p className="text-sm font-medium">Under Review</p>
                          <p className="text-xs text-muted-foreground">In progress</p>
                        </div>
                      </div>
                    )}
                  </div>
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

function Label({ className, children, ...props }: { className?: string; children: React.ReactNode }) {
  return (
    <label className={className} {...props}>
      {children}
    </label>
  )
}
