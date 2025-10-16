import { MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-card border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center mb-8">
          {/* Brand */}
          <div className="space-y-4 text-center">
            <div className="flex items-center justify-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-[hsl(var(--primary-glow))] flex items-center justify-center">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold">BuzzYatra</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Making travel safer and smarter for everyone in Bengaluru.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t text-center text-sm text-muted-foreground">
          <p>© 2025 BuzzYatra. All rights reserved. Made with ❤️ in Bengaluru.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
