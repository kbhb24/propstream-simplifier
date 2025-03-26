
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Features = () => {
  const featureCategories = [
    {
      title: "Campaign Management",
      description: "Comprehensive tools for creating and tracking real estate marketing campaigns",
      features: [
        "Comprehensive campaign metrics for direct mail, SMS, and cold calls",
        "Visual data representation with interactive charts",
        "Customizable campaign workflows and sequences",
        "Batch processing for direct mail campaigns",
        "Customizable postcard design with drag-and-drop editor"
      ]
    },
    {
      title: "Lead Management",
      description: "Tools to effectively track and manage your real estate leads",
      features: [
        "Dynamic filtering options for precise lead targeting",
        "Stage-specific tasks that automate based on lead qualification",
        "Detailed interaction history and follow-up tracking",
        "Integrated offer tracking for properties",
        "Upload leads from any source (CSV, Excel, CRM)"
      ]
    },
    {
      title: "Flow Designer",
      description: "Visual workflow builder to automate your real estate business processes",
      features: [
        "Email/SMS/mail triggers that activate based on lead behavior",
        "Lead scoring integration to prioritize high-value prospects",
        "Auto-archiving rules for maintaining clean data",
        "Decision branches for complex workflow scenarios",
        "Drag-and-drop interface for easy workflow creation"
      ]
    },
    {
      title: "Analytics & Reporting",
      description: "Powerful insights into your real estate marketing performance",
      features: [
        "AI-powered analytics that provide predictive insights",
        "Customizable dashboards to monitor KPIs",
        "Campaign ROI calculation and comparison",
        "Property performance tracking",
        "Export and schedule reports"
      ]
    },
    {
      title: "Integrations",
      description: "Connect with your favorite tools and services",
      features: [
        "CRM integration with HubSpot and Salesforce",
        "Marketing automation compatibility with ActiveCampaign",
        "Phone system integration with Twilio",
        "Document management with DocuSign",
        "Expandable integration marketplace"
      ]
    },
    {
      title: "Security & Compliance",
      description: "Enterprise-grade security for your real estate data",
      features: [
        "Data encryption and secure storage",
        "Advanced user permissions and role-based access control",
        "Audit logs for all user activities",
        "GDPR and CCPA compliance tools",
        "Regular security updates and vulnerability testing"
      ]
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-16">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-b from-background to-secondary/20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Powerful Features for Real Estate Professionals
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
              Scale Pro Data Flow offers comprehensive tools to streamline your real estate 
              business, automate workflows, and accelerate growth.
            </p>
            <Button size="lg" asChild className="px-8">
              <Link to="/pricing">Get Started Today</Link>
            </Button>
          </div>
        </section>
        
        {/* Feature Categories */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featureCategories.map((category, index) => (
                <Card key={index} className="h-full">
                  <CardHeader>
                    <CardTitle>{category.title}</CardTitle>
                    <CardDescription>{category.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {category.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start">
                          <Check className="h-5 w-5 text-primary shrink-0 mr-3 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 bg-secondary/20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Real Estate Business?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Join thousands of real estate professionals who have streamlined their operations
              and increased their closing rates with Scale Pro Data Flow.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/pricing">See Pricing Plans</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/flow-designer">Try Flow Designer</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Features;
