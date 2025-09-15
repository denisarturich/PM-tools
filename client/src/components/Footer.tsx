import { Linkedin } from "lucide-react";
import authorPhoto from "@assets/author-photo.png";

export default function Footer() {
  return (
    <footer className="w-full border-t mt-10 py-6 bg-muted/30">
      <div className="max-w-4xl mx-auto flex flex-col items-center gap-3 px-4">
        <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center shadow-md overflow-hidden">
          <img 
            src={authorPhoto} 
            alt="Денис Николаев" 
            className="w-full h-full object-cover"
          />
        </div>
        <p className="text-center text-sm text-muted-foreground">
          Сделано с любовью для менеджеров проектов<br />
          Автор: <span className="font-medium text-foreground">Денис Николаев</span>
        </p>
        <a
          href="https://www.linkedin.com/in/nikden/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-primary hover:underline transition-colors"
          data-testid="link-author-linkedin"
        >
          <Linkedin className="w-4 h-4" /> LinkedIn
        </a>
      </div>
    </footer>
  );
}