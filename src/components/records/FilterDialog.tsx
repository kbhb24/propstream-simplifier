import React, { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Plus, ChevronDown, ChevronUp, Save, Folder } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface FilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApplyFilters: (filters: Filter[]) => void;
}

type FilterCategory = 
  | 'GENERAL'
  | 'TASK FILTERS'
  | 'PROPERTY FILTERS'
  | 'OWNER FILTERS'
  | 'OFFER FILTERS'
  | 'MARKETING'
  | 'ADDITIONAL FIELDS';

type FilterOperator = 'equals' | 'contains' | 'greater_than' | 'less_than' | 'between' | 'in' | 'not_in';

interface Filter {
  id: string;
  category: FilterCategory;
  field: string;
  operator: FilterOperator;
  value: any;
}

interface FilterPreset {
  id: string;
  name: string;
  filters: Filter[];
}

const FILTER_CATEGORIES: Record<FilterCategory, string[]> = {
  'GENERAL': [
    'All Lists (AND)',
    'Any Lists (OR)',
    'All Tags (AND)',
    'Any Tags (OR)',
    'Phone Tags',
    'Phone Types',
    'Phone Statuses',
    'List Stacking (Count)',
    'Last Skip Trace Date',
    'Upload Date',
    'Tag Count',
    'Params & Others'
  ],
  'TASK FILTERS': [
    'Task Count',
    'Task',
    'Task Name',
    'Task Assigned To',
    'Task Status'
  ],
  'PROPERTY FILTERS': [
    'Property Street',
    'Property City',
    'Property State',
    'Property County',
    'Property ZIP Code',
    'Property Status',
    'Assignee (User)',
    'Last Vacant Date',
    'Lead Temperature',
    'Last Unvacant'
  ],
  'OWNER FILTERS': [
    'Owner Street',
    'Owner City',
    'Owner State',
    'Owner County',
    'Owner ZIP Code',
    'Phone Count',
    'Email Count',
    'Last Updated Date',
    'Last Updated By',
    'Last Updated Field',
    'Exhausted Owners'
  ],
  'OFFER FILTERS': [
    'Offer Count',
    'Offer Status',
    'Deal Post Contract Status',
    'Last Offer'
  ],
  'MARKETING': [
    'Direct Mail Attempts',
    'Call Attempts',
    'RVM Attempts',
    'SMS Attempts',
    'Direct Mail Attempts (Owner)',
    'Call Attempts (Owner)',
    'RVM Attempts (Owner)',
    'SMS Attempts (Owner)',
    'Last Mail Status',
    'Direct Mail Campaign Status',
    'Direct Mail Campaign Name',
    'Do Not Mail Ever (Property)'
  ],
  'ADDITIONAL FIELDS': [
    'Above Grade',
    'Number of Units',
    'Bathrooms',
    'Bedrooms'
  ]
};

const BASE_PRESETS = [
  'Stacked',
  'Vacant',
  'Ouchies',
  'Equity'
];

export default function FilterDialog({
  open,
  onOpenChange,
  onApplyFilters
}: FilterDialogProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<FilterCategory[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<Filter[]>([]);
  const [presets, setPresets] = useState<FilterPreset[]>([]);
  const [showPresets, setShowPresets] = useState(false);

  const toggleCategory = (category: FilterCategory) => {
    setExpandedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const addFilter = (category: FilterCategory, field: string) => {
    const newFilter: Filter = {
      id: Math.random().toString(36).substr(2, 9),
      category,
      field,
      operator: 'equals',
      value: null
    };
    setSelectedFilters(prev => [...prev, newFilter]);
  };

  const removeFilter = (filterId: string) => {
    setSelectedFilters(prev => prev.filter(f => f.id !== filterId));
  };

  const saveAsPreset = (name: string) => {
    const newPreset: FilterPreset = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      filters: selectedFilters
    };
    setPresets(prev => [...prev, newPreset]);
  };

  const loadPreset = (preset: FilterPreset) => {
    setSelectedFilters(preset.filters);
  };

  const clearFilters = () => {
    setSelectedFilters([]);
    setSearchTerm('');
  };

  const filteredCategories = Object.entries(FILTER_CATEGORIES).filter(([category, fields]) =>
    !searchTerm || fields.some(field =>
      field.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold">Filter Records</h2>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPresets(true)}
            >
              <Folder className="w-4 h-4 mr-2" />
              Load
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => saveAsPreset('New Filter')}
            >
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => saveAsPreset('New Filter')}
            >
              <Plus className="w-4 h-4 mr-2" />
              Save New
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
            >
              Clear
            </Button>
          </div>
        </div>

        <div className="p-4">
          <Input
            placeholder="Search for filter blocks..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="mb-4"
          />

          {selectedFilters.length > 0 && (
            <div className="mb-4 space-y-2">
              {selectedFilters.map(filter => (
                <div
                  key={filter.id}
                  className="flex items-center gap-2 p-2 bg-gray-50 rounded-md"
                >
                  <span>{filter.field}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFilter(filter.id)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          <div className="space-y-4">
            {filteredCategories.map(([category, fields]) => (
              <div key={category}>
                <button
                  className="flex items-center justify-between w-full p-2 text-left font-semibold"
                  onClick={() => toggleCategory(category as FilterCategory)}
                >
                  <span>{category}</span>
                  {expandedCategories.includes(category as FilterCategory) ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
                {expandedCategories.includes(category as FilterCategory) && (
                  <div className="pl-4 space-y-2">
                    {fields
                      .filter(field =>
                        !searchTerm || field.toLowerCase().includes(searchTerm.toLowerCase())
                      )
                      .map(field => (
                        <button
                          key={field}
                          className="w-full p-2 text-left hover:bg-gray-50 rounded-md"
                          onClick={() => addFilter(category as FilterCategory, field)}
                        >
                          {field}
                        </button>
                      ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {showPresets && (
          <div className="border-t p-4">
            <h3 className="font-semibold mb-2">Filter Presets</h3>
            <div className="space-y-2">
              <div className="mb-4">
                <h4 className="text-sm font-medium mb-2">REISIFT BASE PRESETS</h4>
                {BASE_PRESETS.map(preset => (
                  <button
                    key={preset}
                    className="block w-full text-left p-2 text-blue-600 hover:bg-gray-50 rounded-md"
                  >
                    {preset}
                  </button>
                ))}
              </div>
              {presets.map(preset => (
                <button
                  key={preset.id}
                  className="block w-full text-left p-2 hover:bg-gray-50 rounded-md"
                  onClick={() => loadPreset(preset)}
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="border-t p-4 mt-auto">
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                onApplyFilters(selectedFilters);
                onOpenChange(false);
              }}
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 