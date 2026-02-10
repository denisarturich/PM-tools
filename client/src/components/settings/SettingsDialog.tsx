import { useSettings } from '@/contexts/SettingsContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Settings } from 'lucide-react';

export function SettingsDialog() {
  const { aiEnabled, setAIEnabled } = useSettings();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Configure your PM-Tools preferences
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5 flex-1">
              <div className="flex items-center gap-2">
                <Label htmlFor="ai-enabled">AI Assistant</Label>
                {aiEnabled ? (
                  <Badge variant="default" className="text-xs">
                    🤖 Real Claude API
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="text-xs">
                    OFF
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {aiEnabled 
                  ? 'Using Claude Sonnet 4 for intelligent risk analysis'
                  : 'Enable AI-powered risk analysis and suggestions'
                }
              </p>
            </div>
            <Switch
              id="ai-enabled"
              checked={aiEnabled}
              onCheckedChange={setAIEnabled}
            />
          </div>
          
          {aiEnabled && (
            <div className="text-sm bg-primary/10 text-primary p-3 rounded-md border border-primary/20">
              ✅ <strong>Real AI Active!</strong> Your assistant will use Claude API to provide intelligent, context-aware responses.
            </div>
          )}
          
          {!aiEnabled && (
            <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
              💡 AI features are disabled. Toggle on to access AI-powered risk generation, analysis, and mitigation suggestions.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
