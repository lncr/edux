"use client"

import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { UniversityCard } from "@/components/university-card"
import { getUniversities, searchUniversities, University } from "@/lib/data/universities"
import { Search } from "lucide-react"

export default function UniversitiesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<"name" | "ranking" | "students">("ranking")
  const [universities, setUniversities] = useState<University[]>([])
  const [loading, setLoading] = useState(true)

  // Load universities on component mount
  useState(() => {
    async function loadUniversities() {
      setLoading(true)
      try {
        const data = await getUniversities()
        setUniversities(data)
      } catch (error) {
        console.error('Failed to load universities:', error)
      } finally {
        setLoading(false)
      }
    }
    loadUniversities()
  }, [])

  const filteredAndSortedUniversities = useMemo(() => {
    if (!universities.length) return []
    
    const filtered = universities.filter(uni => 
      !searchQuery || 
      uni.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      uni.location.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name)
        case "ranking":
          return (a.ranking || 999) - (b.ranking || 999)
        case "students":
          return b.students - a.students
        default:
          return 0
      }
    })
  }, [universities, searchQuery, sortBy])

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Explore <span className="text-primary">Universities</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Discover world-class universities and find the perfect match for your academic journey.
            </p>
          </div>

          {/* Search and Filter Section */}
          <div className="mb-8 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search universities, locations, or faculties..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex gap-2">
              <Button
                variant={sortBy === "ranking" ? "default" : "outline"}
                onClick={() => setSortBy("ranking")}
                size="sm"
              >
                Ranking
              </Button>
              <Button variant={sortBy === "name" ? "default" : "outline"} onClick={() => setSortBy("name")} size="sm">
                Name
              </Button>
              <Button
                variant={sortBy === "students" ? "default" : "outline"}
                onClick={() => setSortBy("students")}
                size="sm"
              >
                Size
              </Button>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-muted-foreground">
              Showing {filteredAndSortedUniversities.length} of {universities.length} universities
            </p>
          </div>

          {/* Universities Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedUniversities.map((university) => (
              <UniversityCard key={university.id} university={university} />
            ))}
          </div>

          {/* No Results */}
          {filteredAndSortedUniversities.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg mb-4">No universities found matching your search.</p>
              <Button onClick={() => setSearchQuery("")} variant="outline">
                Clear Search
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
