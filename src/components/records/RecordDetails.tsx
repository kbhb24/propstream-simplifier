import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Edit2, Phone, Mail, MessageSquare, Activity, Building } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface RecordDetailsProps {
  record: {
    id: string;
    first_name: string;
    last_name: string;
    company_name?: string;
    mailing_address?: string;
    properties_count: number;
    sold_properties: number;
    leads_count: number;
    offers_count: number;
    calls_made: number;
    verified_numbers_percentage: number;
    total_investment: number;
    phone_numbers: Array<{
      number: string;
      type: string;
      verified: boolean;
    }>;
    emails: string[];
    properties: Array<{
      id: string;
      address: string;
      city: string;
      state: string;
      zip: string;
    }>;
  };
}

interface MetricCardProps {
  label: string;
  value: string | number;
  suffix?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ label, value, suffix }) => (
  <div className="bg-white rounded-lg p-4 text-center">
    <div className="text-2xl font-semibold">
      {value}
      {suffix && <span className="text-gray-500 text-lg ml-1">{suffix}</span>}
    </div>
    <div className="text-sm text-gray-600 mt-1">{label}</div>
  </div>
);

const MarketingMetric: React.FC<{ label: string; value: number }> = ({ label, value }) => (
  <div className="flex justify-between items-center py-2">
    <span className="text-gray-600">{label}</span>
    <div className="flex items-center gap-2">
      <span className="font-semibold">{value}</span>
      <Button variant="outline" size="sm">+</Button>
    </div>
  </div>
);

export default function RecordDetails({ record }: RecordDetailsProps) {
  const [activeTab, setActiveTab] = useState('properties');

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">
            {record.first_name} {record.last_name}
          </h1>
          {record.company_name && (
            <p className="text-gray-600">{record.company_name}</p>
          )}
          {record.mailing_address && (
            <p className="text-gray-600 text-sm">{record.mailing_address}</p>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Edit2 className="w-4 h-4" />
            Mark as a contact
          </Button>
          <Button className="flex items-center gap-2">
            Skip Trace Owner
          </Button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-7 gap-4">
        <MetricCard label="Property" value={record.properties_count} />
        <MetricCard label="Sold Properties" value={record.sold_properties} />
        <MetricCard label="Leads" value={record.leads_count} />
        <MetricCard label="Offers" value={record.offers_count} />
        <MetricCard label="Calls Made" value={record.calls_made} />
        <MetricCard label="Verified Numbers" value={record.verified_numbers_percentage} suffix="%" />
        <MetricCard label="Total Investment" value={`$${record.total_investment}`} />
      </div>

      {/* Main Content */}
      <div className="flex gap-6">
        {/* Left Column - Tabs */}
        <div className="flex-1">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="properties" className="flex items-center gap-2">
                <Building className="w-4 h-4" />
                Properties ({record.properties_count})
              </TabsTrigger>
              <TabsTrigger value="message-board" className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Message Board
              </TabsTrigger>
              <TabsTrigger value="activity" className="flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Activity Log
              </TabsTrigger>
            </TabsList>

            <TabsContent value="properties" className="mt-6">
              {record.properties.map(property => (
                <Card key={property.id} className="p-4 mb-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{property.address}</p>
                      <p className="text-sm text-gray-600">
                        {property.city}, {property.state} {property.zip}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {/* Add your action buttons here */}
                    </div>
                  </div>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="message-board">
              <div className="text-center text-gray-500 py-8">
                No messages yet
              </div>
            </TabsContent>

            <TabsContent value="activity">
              <div className="text-center text-gray-500 py-8">
                No activity recorded
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Column - Contact Info & Marketing */}
        <div className="w-[300px] space-y-6">
          {/* Phone Numbers */}
          <Card className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Phone Numbers
              </h3>
              <span className="text-sm text-gray-500">
                ({record.phone_numbers.length}/30)
              </span>
            </div>
            {record.phone_numbers.length === 0 ? (
              <div className="text-center text-gray-500 py-4">
                <p className="mb-2">You haven't added any phone numbers yet.</p>
                <Button variant="outline" className="w-full">
                  Add New Phone
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {record.phone_numbers.map((phone, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{phone.number}</p>
                      <div className="flex gap-2">
                        <Badge variant="secondary">{phone.type}</Badge>
                        {phone.verified && (
                          <Badge variant="secondary" className="text-green-600">Verified</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Emails */}
          <Card className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Emails
              </h3>
            </div>
            {record.emails.length === 0 ? (
              <div className="text-center text-gray-500 py-4">
                <p className="mb-2">You haven't added any emails yet.</p>
                <Button variant="outline" className="w-full">
                  Add New Email
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {record.emails.map((email, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <p>{email}</p>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Marketing Metrics */}
          <Card className="p-4">
            <h3 className="font-semibold mb-4">Marketing</h3>
            <div className="space-y-2">
              <MarketingMetric label="Call Attempts" value={0} />
              <MarketingMetric label="Direct Mail Attempts" value={0} />
              <MarketingMetric label="SMS Attempts" value={0} />
              <MarketingMetric label="RVM Attempts" value={0} />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
} 