import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t bg-muted/50 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-semibold text-primary mb-4">Edux</h3>
            <p className="text-muted-foreground text-sm">
              Connecting students worldwide with university opportunities.
            </p>
          </div>

          <div>
            <h4 className="font-medium mb-4">Quick Links</h4>
            <div className="space-y-2 text-sm">
              <Link href="/universities" className="block text-muted-foreground hover:text-primary transition-colors">
                Browse Universities
              </Link>
              <Link
                href="/my-applications"
                className="block text-muted-foreground hover:text-primary transition-colors"
              >
                My Applications
              </Link>
              <Link href="/profile" className="block text-muted-foreground hover:text-primary transition-colors">
                Profile
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-4">Support</h4>
            <div className="space-y-2 text-sm">
              <Link href="/about" className="block text-muted-foreground hover:text-primary transition-colors">
                About
              </Link>
              <Link href="/contact" className="block text-muted-foreground hover:text-primary transition-colors">
                Contact
              </Link>
              <Link href="/terms" className="block text-muted-foreground hover:text-primary transition-colors">
                Terms & Privacy
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          © 2024 Edux. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
