import React, { useState, useCallback } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { ReactFlow, Background, Controls, Panel, useNodesState, useEdgesState, addEdge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, Plus, Save, Share, Trash, Edit } from 'lucide-react';

// Initial nodes and edges for the flow
const initialNodes = [
  {
    id: '1',
    type: 'input',
    data: { label: 'Start' },
    position: { x: 250, y: 5 },
  },
  {
    id: '2',
    data: { label: 'Email Campaign' },
    position: { x: 100, y: 100 },
  },
  {
    id: '3',
    data: { label: 'SMS Follow-up' },
    position: { x: 400, y: 100 },
  },
  {
    id: '4',
    type: 'output',
    data: { label: 'Lead Conversion' },
    position: { x: 250, y: 200 },
  },
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e1-3', source: '1', target: '3' },
  { id: 'e2-4', source: '2', target: '4' },
  { id: 'e3-4', source: '3', target: '4' },
];

const FlowDesigner = () => {
  // Use the React Flow hooks to manage nodes and edges
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [flowName, setFlowName] = useState('New Marketing Flow');

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  const handleSave = () => {
    alert('Flow saved!');
  };

  const handleShare = () => {
    alert('Flow shared!');
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this flow?')) {
      alert('Flow deleted!');
    }
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold">{flowName}</h2>
          <p className="text-muted-foreground">Design and automate your marketing workflows</p>
        </div>
        <div className="space-x-2">
          <Button variant="outline">
            <Share className="mr-2 h-4 w-4" />
            Share
          </Button>
          <Button>
            <Save className="mr-2 h-4 w-4" />
            Save Flow
          </Button>
        </div>
      </div>

      <Card className="mb-8">
        <CardHeader className="pb-3">
          <CardTitle>Flow Configuration</CardTitle>
          <CardDescription>Customize your flow with these settings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Input
                placeholder="Flow Name"
                value={flowName}
                onChange={(e) => setFlowName(e.target.value)}
              />
            </div>
            <div>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Flow Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="sales">Sales</SelectItem>
                  <SelectItem value="support">Support</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Button variant="outline" className="w-full">
                <Edit className="mr-2 h-4 w-4" />
                Edit Details
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex h-[calc(100vh-13rem)] bg-card border rounded-lg shadow-sm">
        <div className="w-64 border-r">
          <Tabs defaultValue="nodes" className="flex h-full flex-col">
            <TabsList className="shrink-0 border-b p-4">
              <TabsTrigger value="nodes" className="text-sm">Nodes</TabsTrigger>
              <TabsTrigger value="edges" className="text-sm">Edges</TabsTrigger>
            </TabsList>
            <TabsContent value="nodes" className="grow p-4">
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Available Nodes</h4>
                <Separator />
                <Button variant="ghost" className="w-full justify-start">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Input Node
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Email Node
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Plus className="mr-2 h-4 w-4" />
                  Add SMS Node
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Delay Node
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Condition Node
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="edges" className="grow p-4">
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Available Edges</h4>
                <Separator />
                <p className="text-sm text-muted-foreground">Drag and drop to connect nodes</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="flex-1 relative">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            fitView
          >
            <Background />
            <Controls />
            <Panel position="top-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    Options <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Save className="mr-2 h-4 w-4" />
                    Save
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Share className="mr-2 h-4 w-4" />
                    Share
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-500" onClick={handleDelete}>
                    <Trash className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </Panel>
          </ReactFlow>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FlowDesigner;
