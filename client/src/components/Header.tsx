import { Button } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";
import { Link, useLocation } from "wouter";

export default function Header() {
  const [location] = useLocation();

  return (
    <header className="px-4 pt-6 pb-6 border-b bg-card">
      <div className="container mx-auto">
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <h1 className="text-lg font-semibold text-foreground">
              Prompt Directory for Project Managers
            </h1>
            <p className="text-xs text-muted-foreground">
              Ready-made prompt templates for any project stage
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Navigation buttons */}
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
          </div>
        </div>
      </div>
    </header>
  );
}
