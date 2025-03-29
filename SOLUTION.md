# Solution for Record Detail Page Loading Issues

## Problem
The record detail page is failing to load individual records, showing a 400 error when fetching from Supabase. The error is related to the complex joins in the query being used to fetch the record and its related data.

## Analysis
The current implementation in `RecordDetail.tsx` is using a complex nested query that selects data from multiple related tables at once:
```typescript
const { data, error } = await supabase
  .from('records')
  .select(`
    *,
    record_phone_numbers (*),
    record_emails (*),
    record_attempts (*),
    // ... other tables
  `)
  .eq('id', id)
  .single();
```

This approach is causing issues because:
1. If any of the related tables don't exist in the database schema, the query fails
2. The complex joins can lead to performance issues 
3. There's a type mismatch between the expected structure and what's actually in the database

## Solution

### 1. Create a Simplified Record Detail Page
I've created a debug version of the record detail page that uses a simpler query pattern:

```typescript
// src/pages/debug/SimpleRecordDetail.tsx
const { data, error } = await supabase
  .from('records')
  .select()
  .eq('id', id)
  .maybeSingle();
```

This page:
- Fetches only the main record data without joins
- Uses `.maybeSingle()` which is more forgiving than `.single()` when no record is found
- Has comprehensive error handling
- Displays the raw record data for debugging

### 2. Add Debug Routes and Navigation
- Added a route at `/debug/record/:id` to access the simplified record detail page
- Added a debug button to the Records list that links to this page
- This allows testing the record fetching without the complexity of related data

### 3. Next Steps for Production Fix

For the production fix, we recommend modifying the `RecordDetail.tsx` component to:

1. First fetch just the main record:
```typescript
const { data, error } = await supabase
  .from('records')
  .select()
  .eq('id', id)
  .single();
```

2. Then separately fetch related data as needed, with proper error handling:
```typescript
// Initialize with empty arrays
const recordWithRelations = {
  ...data,
  record_phone_numbers: [],
  record_emails: [],
  // ... other related data initialized as empty arrays
};

// Fetch phone numbers if that table exists
try {
  const { data: phoneNumbers } = await supabase
    .from('record_phone_numbers')
    .select()
    .eq('record_id', id);
  
  if (phoneNumbers) {
    recordWithRelations.record_phone_numbers = phoneNumbers;
  }
} catch (err) {
  console.error('Error fetching phone numbers:', err);
}

// Similar pattern for other related data
```

3. This approach:
   - Is more resilient to schema changes
   - Provides better error handling for each related table
   - Improves performance by only fetching what's needed
   - Still presents a complete data structure to the UI

### 4. How to Test the Solution

1. Navigate to the Records page
2. Click the debug icon (🐞) next to any record
3. Verify that the simplified record detail page loads correctly
4. Check the browser console for detailed logs of the fetching process
5. Once confirmed working, implement the changes in the main RecordDetail component

## Additional Recommendations

1. Consider adding proper TypeScript types for all database tables to catch schema mismatches at compile time
2. Use the Supabase CLI to generate types from your actual database schema
3. Add more comprehensive error handling throughout the application
4. Consider implementing lazy loading for related data in the UI to improve performance 