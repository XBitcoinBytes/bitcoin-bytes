import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Accessibility, Type, Contrast, Volume2 } from "lucide-react";

export default function AccessibilityPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [highContrast, setHighContrast] = useState(false);
  const [screenReader, setScreenReader] = useState(false);

  const increaseFontSize = () => {
    const newSize = Math.min(fontSize + 2, 24);
    setFontSize(newSize);
    document.documentElement.style.fontSize = `${newSize}px`;
  };

  const decreaseFontSize = () => {
    const newSize = Math.max(fontSize - 2, 12);
    setFontSize(newSize);
    document.documentElement.style.fontSize = `${newSize}px`;
  };

  const toggleHighContrast = () => {
    setHighContrast(!highContrast);
    document.documentElement.classList.toggle('high-contrast', !highContrast);
  };

  const toggleScreenReader = () => {
    setScreenReader(!screenReader);
    if (!screenReader) {
      // Announce when screen reader mode is enabled
      const announcement = document.createElement('div');
      announcement.setAttribute('aria-live', 'polite');
      announcement.setAttribute('aria-atomic', 'true');
      announcement.className = 'sr-only';
      announcement.textContent = 'Screen reader accessibility mode enabled. Press Tab to navigate through interactive elements.';
      document.body.appendChild(announcement);
      setTimeout(() => document.body.removeChild(announcement), 3000);
    }
  };

  return (
    <>
      <Button
        className="fixed bottom-4 right-4 z-50 w-12 h-12 rounded-full bg-bitcoin hover:bg-bitcoin/80 text-black shadow-lg cyber-glow"
        onClick={() => setIsOpen(true)}
        aria-label="Open accessibility options"
      >
        <Accessibility className="w-6 h-6" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="bg-dark-bg border-bitcoin/30" role="dialog" aria-labelledby="accessibility-title" aria-describedby="accessibility-description">
          <DialogHeader>
            <DialogTitle id="accessibility-title" className="text-bitcoin text-xl font-bold">
              Accessibility Options
            </DialogTitle>
          </DialogHeader>
          
          <div id="accessibility-description" className="space-y-6 text-gray-200">
            <p className="text-sm">Customize your viewing experience for better accessibility.</p>
            
            {/* Font Size Controls */}
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center">
                <Type className="w-4 h-4 mr-2 text-bitcoin" />
                Font Size
              </h3>
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={decreaseFontSize}
                  disabled={fontSize <= 12}
                  className="border-bitcoin/50 text-bitcoin hover:bg-bitcoin/10"
                  aria-label="Decrease font size"
                >
                  A-
                </Button>
                <span className="text-sm min-w-[60px] text-center" aria-live="polite">
                  {fontSize}px
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={increaseFontSize}
                  disabled={fontSize >= 24}
                  className="border-bitcoin/50 text-bitcoin hover:bg-bitcoin/10"
                  aria-label="Increase font size"
                >
                  A+
                </Button>
              </div>
            </div>

            {/* High Contrast */}
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center">
                <Contrast className="w-4 h-4 mr-2 text-bitcoin" />
                High Contrast Mode
              </h3>
              <div className="flex items-center space-x-3">
                <Switch
                  checked={highContrast}
                  onCheckedChange={toggleHighContrast}
                  aria-describedby="contrast-description"
                />
                <span id="contrast-description" className="text-sm">
                  Enhance text visibility with higher contrast colors
                </span>
              </div>
            </div>

            {/* Screen Reader Support */}
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center">
                <Volume2 className="w-4 h-4 mr-2 text-bitcoin" />
                Screen Reader Support
              </h3>
              <div className="flex items-center space-x-3">
                <Switch
                  checked={screenReader}
                  onCheckedChange={toggleScreenReader}
                  aria-describedby="reader-description"
                />
                <span id="reader-description" className="text-sm">
                  Enhanced navigation for screen readers
                </span>
              </div>
            </div>

            {/* Keyboard Navigation Info */}
            <div className="border-t border-bitcoin/20 pt-4">
              <h4 className="font-semibold text-sm mb-2">Keyboard Navigation:</h4>
              <ul className="text-xs space-y-1 text-gray-400">
                <li><kbd className="bg-gray-700 px-1 rounded">Tab</kbd> - Navigate forward</li>
                <li><kbd className="bg-gray-700 px-1 rounded">Shift + Tab</kbd> - Navigate backward</li>
                <li><kbd className="bg-gray-700 px-1 rounded">Enter</kbd> - Activate buttons/links</li>
                <li><kbd className="bg-gray-700 px-1 rounded">Esc</kbd> - Close dialogs</li>
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}