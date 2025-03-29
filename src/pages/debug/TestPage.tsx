import React from 'react';
import { TestRecordInsertion } from '@/components/debug/TestRecordInsertion';

export default function TestPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Debug Testing Page</h1>
      <TestRecordInsertion />
    </div>
  );
} 