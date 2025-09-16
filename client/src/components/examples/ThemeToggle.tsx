import ThemeToggle from '../ThemeToggle';
import { ThemeProvider } from '../../lib/theme';

export default function ThemeToggleExample() {
  return (
    <ThemeProvider>
      <div className="p-4 flex items-center gap-4">
        <span className="text-sm">Switch theme:</span>
        <ThemeToggle />
      </div>
    </ThemeProvider>
  );
}