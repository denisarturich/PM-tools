import { Button } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";
import { Link, useLocation } from "wouter";

export default function Header() {
  const [location] = useLocation();

  // Dynamic content based on current page
  const pageContent = {
    '/': {
      title: 'Prompt Directory for Project Managers',
      description: 'Ready-made prompt templates for any project stage'
    },
    '/risk-management': {
      title: 'Risk Management',
      description: 'Identify, assess, and mitigate project risks'
    },
    '/retrospective-builder': {
      title: 'Retrospective Builder',
      description: 'Mix and match activities to craft the perfect retro'
    }
  };

  const currentPage = pageContent[location as keyof typeof pageContent] || pageContent['/'];

  return (
    <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container mx-auto px-6 max-w-7xl py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Breadcrumb-style left section */}
          <div className="flex items-center gap-3">
            {/* Site name */}
            <Link href="/">
              <h1 className="text-2xl font-bold text-foreground hover:text-primary transition-colors cursor-pointer">
                PM-Tools
              </h1>
            </Link>
            
            {/* Separator */}
            <span className="text-2xl text-muted-foreground">›</span>
            
            {/* Dynamic page info */}
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-foreground">
                {currentPage.title}
              </span>
              <span className="text-xs text-muted-foreground">
                {currentPage.description}
              </span>
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="flex items-center gap-2">
            <Button
              asChild
              variant={location === '/' ? 'default' : 'ghost'}
              size="sm"
            >
              <Link href="/">
                Prompts
              </Link>
            </Button>
            
            <Button
              asChild
              variant={location === '/risk-management' ? 'default' : 'ghost'}
              size="sm"
              className="flex items-center gap-2"
            >
              <Link href="/risk-management">
                <ShieldAlert className="h-4 w-4" />
                Risk Management
              </Link>
            </Button>

            <Button
              asChild
              variant={location === '/retrospective-builder' ? 'default' : 'ghost'}
              size="sm"
              className="flex items-center gap-2"
            >
              <Link href="/retrospective-builder">
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {/* Top-left card */}
                  <rect x="1" y="1" width="6" height="6" rx="1.2" />
                  {/* Top-right card */}
                  <rect x="9" y="1" width="6" height="6" rx="1.2" />
                  {/* Bottom-left card */}
                  <rect x="1" y="9" width="6" height="6" rx="1.2" />
                  {/* Bottom-right card */}
                  <rect x="9" y="9" width="6" height="6" rx="1.2" />
                </svg>
                Retro Builder
              </Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
