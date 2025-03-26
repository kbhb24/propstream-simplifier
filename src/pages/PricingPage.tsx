
import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const PricingPage = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const plans = [
    {
      name: "Essential",
      description: "Perfect for small to medium real estate investors",
      monthlyPrice: 99,
      yearlyPrice: 990,
      features: [
        "25 Flows",
        "30 phone numbers/record",
        "25k new properties/month",
        "Email & SMS campaigns",
        "Basic lead management",
        "Standard support",
        "1 user account"
      ],
      cta: "Get Essential",
      popular: false
    },
    {
      name: "Advanced",
      description: "Ideal for growing real estate businesses",
      monthlyPrice: 199,
      yearlyPrice: 1990,
      features: [
        "Unlimited Flows",
        "100 phone numbers/record",
        "50k properties/month",
        "AI optimization",
        "Advanced lead scoring",
        "Priority support",
        "5 user accounts"
      ],
      cta: "Get Advanced",
      popular: true
    },
    {
      name: "Enterprise",
      description: "For large scale real estate operations",
      monthlyPrice: 399,
      yearlyPrice: 3990,
      features: [
        "Unlimited everything",
        "Dedicated success manager",
        "Custom API access",
        "White labeling options",
        "Advanced analytics",
        "24/7 premium support",
        "Unlimited user accounts"
      ],
      cta: "Contact Sales",
      popular: false
    }
  ];

  const savings = {
    "Essential": 198,
    "Advanced": 398,
    "Enterprise": 798
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-16">
        {/* Pricing Header */}
        <section className="py-20 bg-gradient-to-b from-background to-secondary/20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
              Choose the plan that works best for your real estate business needs.
              All plans include core features to help you grow.
            </p>
            
            {/* Billing Toggle */}
            <div className="flex items-center justify-center mb-10">
              <Label htmlFor="billing-toggle" className={billingCycle === 'monthly' ? 'font-semibold' : ''}>Monthly</Label>
              <Switch 
                id="billing-toggle" 
                className="mx-4"
                checked={billingCycle === 'yearly'}
                onCheckedChange={(checked) => setBillingCycle(checked ? 'yearly' : 'monthly')}
              />
              <div className="flex flex-col items-start">
                <Label htmlFor="billing-toggle" className={billingCycle === 'yearly' ? 'font-semibold' : ''}>Annual</Label>
                <span className="text-xs text-primary font-medium">Save up to 20%</span>
              </div>
            </div>
          </div>
        </section>
        
        {/* Pricing Cards */}
        <section className="py-10 pb-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {plans.map((plan, index) => (
                <Card key={index} className={`${
                  plan.popular ? 'border-primary shadow-lg relative' : ''
                } flex flex-col h-full`}>
                  {plan.popular && (
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <span className="bg-primary text-primary-foreground text-xs font-semibold py-1 px-3 rounded-full">
                        MOST POPULAR
                      </span>
                    </div>
                  )}
                  <CardHeader className="flex-grow-0">
                    <CardTitle>{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <div className="mb-6">
                      <div className="flex items-baseline">
                        <span className="text-4xl font-bold">
                          ${billingCycle === 'monthly' ? plan.monthlyPrice : Math.round(plan.yearlyPrice / 12)}
                        </span>
                        <span className="text-muted-foreground ml-2">/month</span>
                      </div>
                      {billingCycle === 'yearly' && (
                        <div className="mt-1">
                          <span className="text-sm text-primary font-medium">
                            Billed annually (${plan.yearlyPrice}/year)
                          </span>
                        </div>
                      )}
                      {billingCycle === 'yearly' && (
                        <div className="mt-1">
                          <span className="text-sm text-muted-foreground">
                            Save ${savings[plan.name as keyof typeof savings]} per year
                          </span>
                        </div>
                      )}
                    </div>
                    <ul className="space-y-3">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start">
                          <Check className="h-5 w-5 text-primary shrink-0 mr-3 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter className="flex-grow-0 pt-6">
                    <Button variant={plan.popular ? "default" : "outline"} size="lg" className="w-full">
                      {plan.cta}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>
        
        {/* FAQ Section */}
        <section className="py-20 bg-secondary/20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">Can I switch plans later?</h3>
                <p className="text-muted-foreground">Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">Is there a free trial?</h3>
                <p className="text-muted-foreground">We offer a 14-day free trial on all plans so you can test the features before committing.</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">What payment methods do you accept?</h3>
                <p className="text-muted-foreground">We accept all major credit cards, ACH transfers, and PayPal for payment.</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">Can I get a refund?</h3>
                <p className="text-muted-foreground">We offer a 30-day money-back guarantee if you're not satisfied with our service.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default PricingPage;
