"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { getUniversityById, type University } from "@/lib/data/universities";
import {
  MapPin,
  Users,
  Calendar,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface UniversityDetailPageProps {
  params: { id: string };
}

type Faculty = { id: number | string; name: string };
type Division = { id: number | string; name: string };
type GalleryItem = { id: number | string; image: string };

type UniversityFull = University & {
  description?: string;
  image?: string | null;
  faculties?: Faculty[];
  divisions?: Division[];
  gallery?: GalleryItem[];
};

export default function UniversityDetailPage({
  params,
}: UniversityDetailPageProps) {
  const router = useRouter();
  const [university, setUniversity] = useState<UniversityFull | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = (await getUniversityById(
          params.id
        )) as UniversityFull | null;
        if (cancelled) return;
        if (!data) {
          router.replace("/404");
          return;
        }
        setUniversity(data);
      } catch (e) {
        console.error("Failed to load university:", e);
        if (!cancelled) router.replace("/404");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [params.id, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-muted-foreground">Loading…</span>
      </div>
    );
  }

  if (!university) return null;

  const faculties: Faculty[] = university.faculties ?? [];
  const divisions: Division[] = university.divisions ?? [];
  const gallery: GalleryItem[] = university.gallery ?? [];

  const heroImage =
    university.image ||
    university.thumbnail ||
    gallery[0]?.image ||
    "/placeholder.svg";

  const nextImage = () =>
    setCurrentImageIndex((i) =>
      gallery.length ? (i + 1) % gallery.length : 0
    );
  const prevImage = () =>
    setCurrentImageIndex((i) =>
      gallery.length ? (i - 1 + gallery.length) % gallery.length : 0
    );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Back */}
        <div className="container mx-auto px-4 pt-6">
          <Button variant="ghost" asChild>
            <Link href="/universities">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Universities
            </Link>
          </Button>
        </div>

        {/* Hero */}
        <div className="relative h-96 mt-4 overflow-hidden">
          <img
            src={heroImage}
            alt={university.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                {university.name}
              </h1>
              <div className="flex items-center justify-center gap-2 text-lg">
                <MapPin className="h-5 w-5" />
                <span>{university.location}</span>
              </div>
            </div>
          </div>
          {!!university.ranking && (
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
                  <p className="text-2xl font-bold">
                    {typeof university.students === "number"
                      ? university.students.toLocaleString()
                      : university.students}
                  </p>
                  <p className="text-muted-foreground">Students</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <GraduationCap className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{faculties.length}</p>
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
                  <p className="text-muted-foreground leading-relaxed">
                    {university.description ?? (
                      <>
                        {university.name} is located in {university.location}{" "}
                        and was established in {university.established}. It
                        currently has approximately{" "}
                        {typeof university.students === "number"
                          ? university.students.toLocaleString()
                          : university.students}{" "}
                        students.
                      </>
                    )}
                  </p>
                </CardContent>
              </Card>

              {/* Faculties */}
              {faculties.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Faculties</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {faculties.map((f) => (
                        <div
                          key={String(f.id)}
                          className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg"
                        >
                          <GraduationCap className="h-4 w-4 text-primary" />
                          <span className="text-sm">{f.name}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Divisions */}
              {divisions.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Academic Divisions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {divisions.map((d) => (
                        <div
                          key={String(d.id)}
                          className="flex items-center gap-2 p-2"
                        >
                          <div className="w-2 h-2 bg-primary rounded-full" />
                          <span>{d.name}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Image Gallery */}
              <Card>
                <CardHeader>
                  <CardTitle>Campus Gallery</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <div className="aspect-video relative overflow-hidden rounded-lg">
                      <img
                        src={
                          gallery[currentImageIndex]?.image ||
                          "/placeholder.svg"
                        }
                        alt={`${university.name} campus ${
                          currentImageIndex + 1
                        }`}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {gallery.length > 1 && (
                      <>
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
                          {gallery.map((_, index) => (
                            <button
                              key={index}
                              className={`w-2 h-2 rounded-full transition-colors ${
                                index === currentImageIndex
                                  ? "bg-primary"
                                  : "bg-muted"
                              }`}
                              onClick={() => setCurrentImageIndex(index)}
                            />
                          ))}
                        </div>
                      </>
                    )}
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
                  <p className="text-sm text-muted-foreground">
                    Ready to start your application to {university.name}?
                  </p>
                  <Button asChild className="w-full">
                    <Link href={`/apply?university=${university.id}`}>
                      Start Application
                    </Link>
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
                    <span className="text-muted-foreground">Founded:</span>
                    <span>{university.established}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Students:</span>
                    <span>
                      {typeof university.students === "number"
                        ? university.students.toLocaleString()
                        : university.students}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Location:</span>
                    <span>{university.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Ranking:</span>
                    <span>#{university.ranking}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
