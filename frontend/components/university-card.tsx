import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Users, Calendar } from "lucide-react"
import type { University } from "@/lib/data/universities"

interface UniversityCardProps {
  university: University
}

export function UniversityCard({ university }: UniversityCardProps) {
  return (
    <Link href={`/universities/${university.id}`}>
      <Card className="group hover:shadow-lg transition-all duration-200 cursor-pointer">
        <div className="aspect-video relative overflow-hidden rounded-t-lg">
          <img
            src={university.thumbnail || "/placeholder.svg"}
            alt={university.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
          {university.ranking && <Badge className="absolute top-2 right-2 bg-primary">#{university.ranking}</Badge>}
        </div>

        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">{university.name}</h3>

          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>{university.location}</span>
            </div>

            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>{university.students.toLocaleString()} students</span>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Est. {university.established}</span>
            </div>
          </div>

          <p className="text-sm text-muted-foreground mt-3 line-clamp-2">{university.description}</p>
        </CardContent>
      </Card>
    </Link>
  )
}
