"use client"

import { useState } from "react"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getUniversityById } from "@/lib/data/universities"
import { MapPin, Users, Calendar, GraduationCap, ChevronLeft, ChevronRight } from "lucide-react"

interface UniversityDetailPageProps {
  params: {
    id: string
  }
}

export default function UniversityDetailPage({ params }: UniversityDetailPageProps) {
  const university = getUniversityById(params.id)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  if (!university) {
    notFound()
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev === university.gallery.length - 1 ? 0 : prev + 1))
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? university.gallery.length - 1 : prev - 1))
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <div className="relative h-96 overflow-hidden">
          <img
            src={university.image || "/placeholder.svg"}
            alt={university.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">{university.name}</h1>
              <div className="flex items-center justify-center gap-2 text-lg">
                <MapPin className="h-5 w-5" />
                <span>{university.location}</span>
              </div>
            </div>
          </div>
          {university.ranking && (
            <Badge className="absolute top-4 right-4 bg-primary text-lg px-3 py-1">
              World Ranking #{university.ranking}
            </Badge>
          )}
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <Calendar className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{university.established}</p>
                  <p className="text-muted-foreground">Established</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <Users className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{university.students.toLocaleString()}</p>
                  <p className="text-muted-foreground">Students</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <GraduationCap className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{university.faculties.length}</p>
                  <p className="text-muted-foreground">Faculties</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              <Card>
                <CardHeader>
                  <CardTitle>About {university.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{university.description}</p>
                </CardContent>
              </Card>

              {/* Faculties */}
              <Card>
                <CardHeader>
                  <CardTitle>Faculties</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {university.faculties.map((faculty, index) => (
                      <div key={index} className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                        <GraduationCap className="h-4 w-4 text-primary" />
                        <span className="text-sm">{faculty}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Divisions */}
              <Card>
                <CardHeader>
                  <CardTitle>Academic Divisions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {university.divisions.map((division, index) => (
                      <div key={index} className="flex items-center gap-2 p-2">
                        <div className="w-2 h-2 bg-primary rounded-full" />
                        <span>{division}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Image Gallery */}
              <Card>
                <CardHeader>
                  <CardTitle>Campus Gallery</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <div className="aspect-video relative overflow-hidden rounded-lg">
                      <img
                        src={university.gallery[currentImageIndex] || "/placeholder.svg"}
                        alt={`${university.name} campus ${currentImageIndex + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-background/80"
                      onClick={prevImage}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-background/80"
                      onClick={nextImage}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>

                    <div className="flex justify-center gap-2 mt-4">
                      {university.gallery.map((_, index) => (
                        <button
                          key={index}
                          className={`w-2 h-2 rounded-full transition-colors ${
                            index === currentImageIndex ? "bg-primary" : "bg-muted"
                          }`}
                          onClick={() => setCurrentImageIndex(index)}
                        />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Apply Now</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">Ready to start your application to {university.name}?</p>
                  <Button asChild className="w-full">
                    <Link href={`/apply?university=${university.id}`}>Start Application</Link>
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent">
                    Download Brochure
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Facts</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type:</span>
                    <span>Research University</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Founded:</span>
                    <span>{university.established}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Students:</span>
                    <span>{university.students.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Location:</span>
                    <span>{university.location}</span>
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
