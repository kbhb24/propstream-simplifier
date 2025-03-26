
import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const year = new Date().getFullYear();

  const footerLinks = [
    {
      title: "Product",
      links: [
        { name: "Features", path: "/features" },
        { name: "Pricing", path: "/pricing" },
        { name: "Flow Designer", path: "/flow-designer" },
        { name: "Integrations", path: "/integrations" },
      ],
    },
    {
      title: "Resources",
      links: [
        { name: "Documentation", path: "/docs" },
        { name: "Tutorials", path: "/tutorials" },
        { name: "Blog", path: "/blog" },
        { name: "Support", path: "/support" },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "About", path: "/about" },
        { name: "Careers", path: "/careers" },
        { name: "Contact", path: "/contact" },
        { name: "Legal", path: "/legal" },
      ],
    },
  ];

  return (
    <footer className="bg-secondary/50 border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <Link
              to="/"
              className="text-2xl font-bold text-primary inline-block mb-4"
            >
              RealFlow
            </Link>
            <p className="text-muted-foreground mb-4 max-w-md">
              The most intuitive real estate CRM with automated workflows, phone
              system integration, and competitive analysis tools to help you
              close more deals.
            </p>
            <p className="text-sm text-muted-foreground">
              © {year} RealFlow. All rights reserved.
            </p>
          </div>

          {footerLinks.map((column) => (
            <div key={column.title}>
              <h3 className="font-semibold text-foreground mb-4">
                {column.title}
              </h3>
              <ul className="space-y-3">
                {column.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
