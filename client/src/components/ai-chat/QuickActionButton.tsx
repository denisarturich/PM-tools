import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface QuickActionButtonProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}

export function QuickActionButton({
  icon,
  title,
  description,
  onClick,
}: QuickActionButtonProps) {
  return (
    <Card 
      className="p-3 cursor-pointer hover:bg-accent transition-colors"
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        {/* Icon - слева */}
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
          <div className="text-primary">
            {icon}
          </div>
        </div>
        
        {/* Text - справа от иконки */}
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm mb-0.5">{title}</h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </Card>
  );
}
