import { Card } from "@/components/ui/card";
import { AlertCircle, Bell, MapPin, Shield } from "lucide-react";
import sosFeature from "@/assets/sos-feature.jpg";
import stopAlertsFeature from "@/assets/stop-alerts-feature.jpg";

const Features = () => {
  const features = [
    {
      icon: AlertCircle,
      title: "SOS Alerts",
      description: "Instantly send emergency alerts to your predefined contacts with your exact location. One tap can save lives.",
      image: sosFeature,
      gradient: "from-destructive to-[hsl(var(--secondary))]",
    },
    {
      icon: Bell,
      title: "Stop Alerts",
      description: "Get notified when your bus stop or destination is approaching. Never miss your stop again with smart distance-based alerts.",
      image: stopAlertsFeature,
      gradient: "from-primary to-[hsl(var(--primary-glow))]",
    },
  ];

  const benefits = [
    {
      icon: Shield,
      title: "Enhanced Safety",
      description: "Feel secure knowing help is just one tap away with instant SOS alerts to trusted contacts.",
    },
    {
      icon: MapPin,
      title: "Location Precision",
      description: "Advanced GPS tracking ensures accurate location sharing and timely stop notifications.",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl md:text-5xl font-bold">
            Two Powerful Features,{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              One Solution
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            BuzzYatra combines safety and convenience to transform your daily commute in Bengaluru
          </p>
        </div>

        {/* Main Features */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-[var(--shadow-soft)]"
            >
              <div className="p-8 space-y-6">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center`}>
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>

                <div className="rounded-xl overflow-hidden">
                  <img
                    src={feature.image}
                    alt={`${feature.title} feature illustration`}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {benefits.map((benefit, index) => (
            <Card key={index} className="p-6 hover:shadow-[var(--shadow-soft)] transition-all duration-300">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <benefit.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-lg">{benefit.title}</h4>
                  <p className="text-muted-foreground text-sm">{benefit.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
