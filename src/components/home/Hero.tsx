
import React from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="relative overflow-hidden pt-32 pb-16 md:pt-40 md:pb-24">
      {/* Background gradient */}
      <div
        className="absolute inset-0 -z-10 opacity-20 dark:opacity-30"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.8), rgba(59, 130, 246, 0) 50%)",
        }}
      />

      {/* Floating shapes */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full filter blur-3xl -z-10 animate-float opacity-60" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-blue-400/10 rounded-full filter blur-3xl -z-10 animate-float opacity-40" style={{ animationDelay: '1s' }} />

      <div className="container px-4 mx-auto">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 animate-fade-in">
            Streamline Your Real Estate Business with{" "}
            <span className="text-primary">RealFlow</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 md:mb-12 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
            The intelligent CRM designed specifically for real estate
            professionals. Automate workflows, manage leads, and close more deals
            with our powerful suite of tools.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <Link to="/flow-designer">
              <Button size="lg" className="group">
                Try Flow Designer
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link to="/pricing">
              <Button size="lg" variant="outline">
                View Pricing
              </Button>
            </Link>
          </div>
        </div>

        {/* Dashboard Preview */}
        <div className="mt-16 md:mt-24 relative mx-auto max-w-5xl animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <div className="glass-card rounded-lg overflow-hidden shadow-2xl border border-white/20">
            <div className="relative aspect-[16/9] bg-gradient-to-br from-blue-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-2 md:p-6">
              <div className="absolute inset-0 bg-grid-slate-200 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25"></div>
              
              <div className="relative h-full flex flex-col rounded-md bg-white/80 backdrop-blur-sm shadow-sm border border-slate-200/70 dark:bg-slate-800/80 dark:border-slate-700/50">
                <div className="flex items-center border-b border-slate-200/70 dark:border-slate-700/50 p-3">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  </div>
                </div>
                <div className="flex-1 grid grid-cols-12 gap-4 p-4">
                  <div className="col-span-3 space-y-4">
                    <div className="h-8 bg-slate-200/70 dark:bg-slate-700/50 rounded animate-pulse"></div>
                    <div className="h-32 bg-slate-200/70 dark:bg-slate-700/50 rounded"></div>
                    <div className="h-32 bg-slate-200/70 dark:bg-slate-700/50 rounded"></div>
                  </div>
                  <div className="col-span-9 space-y-4">
                    <div className="h-8 bg-slate-200/70 dark:bg-slate-700/50 rounded"></div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="h-48 bg-slate-200/70 dark:bg-slate-700/50 rounded"></div>
                      <div className="h-48 bg-slate-200/70 dark:bg-slate-700/50 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
