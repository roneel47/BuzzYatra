import { Button } from "@/components/ui/button";
import { MapPin, AlertCircle } from "lucide-react";
import heroImage from "@/assets/hero-bengaluru.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Bengaluru cityscape with traffic and urban landscape"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/80 to-background"></div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            Your Safety Companion in{" "}
            <span className="bg-gradient-to-r from-primary to-[hsl(var(--primary-glow))] bg-clip-text text-transparent">
              Bengaluru
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            Never miss your stop. Stay safe with instant SOS alerts. Travel smarter with BuzzYatra.
          </p>

          {/* CTA Button */}
          <div className="flex justify-center items-center pt-4">
            <a href='http://localhost:5173'>
              <Button variant="hero" size="lg" className="text-lg px-8">
                <AlertCircle className="h-5 w-5" />
                Get Started Free
              </Button>
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 pt-12 max-w-2xl mx-auto">
            <div className="space-y-2">
              <p className="text-3xl md:text-4xl font-bold text-primary">24/7</p>
              <p className="text-sm text-muted-foreground">Always Active</p>
            </div>
            <div className="space-y-2">
              <p className="text-3xl md:text-4xl font-bold text-primary">Instant</p>
              <p className="text-sm text-muted-foreground">SOS Alerts</p>
            </div>
            <div className="col-span-2 md:col-span-1 space-y-2">
              <p className="text-3xl md:text-4xl font-bold text-primary">Smart</p>
              <p className="text-sm text-muted-foreground">Location Tracking</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
