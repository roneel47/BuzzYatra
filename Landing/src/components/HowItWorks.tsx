import { Card } from "@/components/ui/card";
import { Download, Settings, Bell, CheckCircle } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      icon: Download,
      title: "Open BuzzYatra",
      description: "Access BuzzYatra directly in your browser - no download required. Works on any device.",
      step: "01",
    },
    {
      icon: Settings,
      title: "Set Up Alerts",
      description: "Add emergency contacts for SOS and configure your frequently used stops.",
      step: "02",
    },
    {
      icon: Bell,
      title: "Enable Permissions",
      description: "Allow location access and notifications to receive timely alerts.",
      step: "03",
    },
    {
      icon: CheckCircle,
      title: "Travel Safe & Smart",
      description: "Start your journey with confidence knowing you're always connected and informed.",
      step: "04",
    },
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl md:text-5xl font-bold">
            How{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              BuzzYatra Works
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get started in minutes and experience safer, smarter travel in Bengaluru
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <Card
              key={index}
              className="relative p-6 hover:shadow-[var(--shadow-soft)] transition-all duration-300 group"
            >
              {/* Step Number */}
              <div className="absolute top-4 right-4 text-6xl font-bold text-muted/10 group-hover:text-primary/10 transition-colors">
                {step.step}
              </div>

              <div className="space-y-4 relative z-10">
                {/* Icon */}
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-[hsl(var(--primary-glow))] flex items-center justify-center">
                  <step.icon className="h-7 w-7 text-white" />
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">{step.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
