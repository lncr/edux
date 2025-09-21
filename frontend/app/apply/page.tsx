"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getUniversities } from "@/lib/data/universities"
import { UniversityFull } from "@/universities/[id]/page"
import { FileText, Upload, CheckCircle } from "lucide-react"
import { createApplication } from "@/lib/data/applications"

export default function ApplyPage() {
  const searchParams = useSearchParams()
  const preselectedUniversityId = searchParams.get("university")

  const [formData, setFormData] = useState({
    university_id: preselectedUniversityId || "",
    essay: "",
    prior_highest_education: "",
    target_program: "",
    recommendation_letter: null as File | null,
    education_document: null as File | null,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [universities, setUniversities] = useState<UniversityFull[]>([]);
  useEffect(() => {
    (async () => {
      try {
        const data = await getUniversities();
        setUniversities(data);
      } catch (e) {
        console.error("Failed to load universities:", e);
      }
    })();
  }, []);

  const selectedUniversity = universities.find((uni) => uni.id === formData.university_id)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const formDataToSend = new FormData()
      formDataToSend.append("university", formData.university)
      formDataToSend.append("essay", formData.essay)
      formDataToSend.append("prior_highest_education", formData.prior_highest_education)
      formDataToSend.append("target_program", formData.target_program)

      if (formData.recommendation_letter) {
        formDataToSend.append("recommendation_letter", formData.recommendation_letter)
      }
      if (formData.education_document) {
        formDataToSend.append("education_document", formData.education_document)
      }

      await createApplication(formDataToSend)
      setIsLoading(false)
      setIsSubmitted(true)
  }

  const handleFileChange =
    (field: "recommendation_letter" | "education_document") => (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] || null
      setFormData((prev) => ({
        ...prev,
        [field]: file,
      }))
    }

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1 flex items-center justify-center py-12 px-4">
          <Card className="w-full max-w-md text-center">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
              <CardTitle className="text-2xl">Application Submitted!</CardTitle>
              <CardDescription>
                Your application to {selectedUniversity?.name} has been successfully submitted.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                You will receive a confirmation email shortly. You can track your application status in your dashboard.
              </p>

              <div className="space-y-2">
                <Button asChild className="w-full">
                  <a href="/my-applications">View My Applications</a>
                </Button>
                <Button variant="outline" className="w-full bg-transparent" onClick={() => setIsSubmitted(false)}>
                  Submit Another Application
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>

        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Apply to <span className="text-primary">University</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Complete your application form to start your academic journey.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Application Form
              </CardTitle>
              <CardDescription>Please fill out all required fields to submit your application.</CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* University Selection */}
                <div className="space-y-2">
                  <Label htmlFor="university">University *</Label>
                  <Select
                    value={formData.university}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, university: value }))}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a university" />
                    </SelectTrigger>
                    <SelectContent>
                      {universities.map((university) => (
                        <SelectItem key={university.id} value={university.id}>
                          {university.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Target Program */}
                <div className="space-y-2">
                  <Label htmlFor="targetProgram">Target of Application *</Label>
                  <Select
                    value={formData.target_program}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, target_program: value }))}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select target program" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Bachelor">Bachelor's Degree</SelectItem>
                      <SelectItem value="Master">Master's Degree</SelectItem>
                      <SelectItem value="PhD">PhD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Highest Education */}
                <div className="space-y-2">
                  <Label htmlFor="prior_highest_education">Highest Education *</Label>
                  <Select
                    value={formData.prior_highest_education}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, prior_highest_education: value }))}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your highest education" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Middle School">Middle School</SelectItem>
                      <SelectItem value="High School">High School</SelectItem>
                      <SelectItem value="Bachelor">Bachelor's Degree</SelectItem>
                      <SelectItem value="Master">Master's Degree</SelectItem>
                      <SelectItem value="PhD">PhD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Essay */}
                <div className="space-y-2">
                  <Label htmlFor="essay">Personal Statement / Essay *</Label>
                  <Textarea
                    id="essay"
                    placeholder="Tell us about yourself, your goals, and why you want to study at this university..."
                    value={formData.essay}
                    onChange={(e) => setFormData((prev) => ({ ...prev, essay: e.target.value }))}
                    className="min-h-32"
                    required
                  />
                  <p className="text-sm text-muted-foreground">Minimum 200 words recommended</p>
                </div>

                {/* File Uploads */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Recommendation Letter */}
                  <div className="space-y-2">
                    <Label htmlFor="recommendation_letter">Recommendation Letter *</Label>
                    <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                      <input
                        id="recommendation_letter"
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange("recommendation_letter")}
                        className="hidden"
                        required
                      />
                      <label htmlFor="recommendation_letter" className="cursor-pointer">
                        <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          {formData.recommendation_letter
                            ? formData.recommendation_letter.name
                            : "Click to upload PDF or DOC"}
                        </p>
                      </label>
                    </div>
                  </div>

                  {/* Education Document */}
                  <div className="space-y-2">
                    <Label htmlFor="education_document">Document of Highest Education *</Label>
                    <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                      <input
                        id="education_document"
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange("education_document")}
                        className="hidden"
                        required
                      />
                      <label htmlFor="education_document" className="cursor-pointer">
                        <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          {formData.education_document ? formData.education_document.name : "Click to upload PDF or DOC"}
                        </p>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Selected University Info */}
                {selectedUniversity && (
                  <Card className="bg-muted/50">
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2">Applying to:</h3>
                      <div className="flex items-center gap-3">
                        <img
                          src={selectedUniversity.thumbnail || "/placeholder.svg"}
                          alt={selectedUniversity.name}
                          className="w-12 h-12 rounded object-cover"
                        />
                        <div>
                          <p className="font-medium">{selectedUniversity.name}</p>
                          <p className="text-sm text-muted-foreground">{selectedUniversity.location}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Submit Button */}
                <div className="pt-4">
                  <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                    {isLoading ? "Submitting Application..." : "Submit Application"}
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    By submitting this application, you agree to our terms and conditions.
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
