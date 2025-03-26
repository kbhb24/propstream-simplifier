
import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Node,
  Edge,
  Connection,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';
import { 
  Save, 
  Plus, 
  Mail, 
  Phone,
  MessageSquare, 
  Database,
  Settings, 
  Shuffle, 
  Users
} from 'lucide-react';

// Custom Node Types
const nodeTypes = {
  triggerNode: TriggerNode,
  actionNode: ActionNode,
  conditionNode: ConditionNode,
};

function TriggerNode({ data }) {
  return (
    <Card className="min-w-[200px] border-2 border-blue-500">
      <CardHeader className="p-3 bg-blue-50 dark:bg-blue-950">
        <CardTitle className="text-sm flex items-center gap-2">
          {data.icon}
          {data.label}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 text-xs">
        {data.description}
      </CardContent>
    </Card>
  );
}

function ActionNode({ data }) {
  return (
    <Card className="min-w-[200px] border-2 border-green-500">
      <CardHeader className="p-3 bg-green-50 dark:bg-green-950">
        <CardTitle className="text-sm flex items-center gap-2">
          {data.icon}
          {data.label}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 text-xs">
        {data.description}
      </CardContent>
    </Card>
  );
}

function ConditionNode({ data }) {
  return (
    <Card className="min-w-[200px] border-2 border-amber-500">
      <CardHeader className="p-3 bg-amber-50 dark:bg-amber-950">
        <CardTitle className="text-sm flex items-center gap-2">
          {data.icon}
          {data.label}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 text-xs">
        {data.description}
      </CardContent>
    </Card>
  );
}

// Initial nodes
const initialNodes: Node[] = [
  {
    id: '1',
    type: 'triggerNode',
    position: { x: 250, y: 100 },
    data: { 
      label: 'New Lead Trigger', 
      description: 'Activates when a new lead is added to the system',
      icon: <Database className="h-4 w-4" /> 
    },
  },
];

// Initial edges
const initialEdges: Edge[] = [];

const FlowDesigner = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [flowName, setFlowName] = useState('New Flow');
  const [activeTab, setActiveTab] = useState('triggers');
  const navigate = useNavigate();

  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) => addEdge({
        ...params,
        markerEnd: { type: MarkerType.ArrowClosed },
        animated: true,
      }, eds))
    },
    [setEdges],
  );

  const handleAddNode = (type: string, label: string, description: string, icon: JSX.Element) => {
    const newNode: Node = {
      id: (nodes.length + 1).toString(),
      type: type,
      position: {
        x: Math.random() * 300 + 200,
        y: Math.random() * 300 + 100,
      },
      data: { label, description, icon },
    };
    setNodes((nds) => [...nds, newNode]);
  };

  const handleSaveFlow = () => {
    toast({
      title: "Flow saved",
      description: `"${flowName}" has been saved successfully.`,
    });
  };

  return (
    <div className="flex h-screen flex-col">
      {/* Top Bar */}
      <div className="border-b border-border p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost"
            size="sm"
            onClick={() => navigate('/dashboard')}
          >
            Back to Dashboard
          </Button>
          <Separator orientation="vertical" className="h-6" />
          <div className="flex items-center gap-2">
            <Input
              value={flowName}
              onChange={(e) => setFlowName(e.target.value)}
              className="h-9 w-60"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleSaveFlow}>
            <Save className="h-4 w-4 mr-2" />
            Save Flow
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Node Palette */}
        <div className="w-72 border-r border-border overflow-y-auto p-4">
          <h2 className="text-lg font-semibold mb-4">Flow Elements</h2>
          
          <Tabs defaultValue="triggers" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full mb-4">
              <TabsTrigger value="triggers" className="flex-1">Triggers</TabsTrigger>
              <TabsTrigger value="actions" className="flex-1">Actions</TabsTrigger>
              <TabsTrigger value="conditions" className="flex-1">Conditions</TabsTrigger>
            </TabsList>
            
            <TabsContent value="triggers" className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => handleAddNode('triggerNode', 'Email Received', 'Triggers when a specific email is received', <Mail className="h-4 w-4" />)}
              >
                <Mail className="h-4 w-4 mr-2" />
                Email Received
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => handleAddNode('triggerNode', 'SMS Received', 'Triggers when an SMS message is received', <MessageSquare className="h-4 w-4" />)}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                SMS Received
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => handleAddNode('triggerNode', 'Property Listed', 'Triggers when a new property is listed', <Database className="h-4 w-4" />)}
              >
                <Database className="h-4 w-4 mr-2" />
                Property Listed
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => handleAddNode('triggerNode', 'Lead Score Changed', 'Triggers when a lead score changes', <Users className="h-4 w-4" />)}
              >
                <Users className="h-4 w-4 mr-2" />
                Lead Score Changed
              </Button>
            </TabsContent>
            
            <TabsContent value="actions" className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => handleAddNode('actionNode', 'Send Email', 'Sends an email to the contact', <Mail className="h-4 w-4" />)}
              >
                <Mail className="h-4 w-4 mr-2" />
                Send Email
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => handleAddNode('actionNode', 'Send SMS', 'Sends an SMS to the contact', <MessageSquare className="h-4 w-4" />)}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Send SMS
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => handleAddNode('actionNode', 'Make Phone Call', 'Initiates an automated phone call', <Phone className="h-4 w-4" />)}
              >
                <Phone className="h-4 w-4 mr-2" />
                Make Phone Call
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => handleAddNode('actionNode', 'Update Lead Data', 'Updates information about the lead', <Database className="h-4 w-4" />)}
              >
                <Database className="h-4 w-4 mr-2" />
                Update Lead Data
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => handleAddNode('actionNode', 'Archive Lead', 'Archives the lead from active status', <Database className="h-4 w-4" />)}
              >
                <Database className="h-4 w-4 mr-2" />
                Archive Lead
              </Button>
            </TabsContent>
            
            <TabsContent value="conditions" className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => handleAddNode('conditionNode', 'Lead Score Check', 'Branches flow based on lead score', <Shuffle className="h-4 w-4" />)}
              >
                <Shuffle className="h-4 w-4 mr-2" />
                Lead Score Check
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => handleAddNode('conditionNode', 'Property Type Check', 'Branches flow based on property type', <Shuffle className="h-4 w-4" />)}
              >
                <Shuffle className="h-4 w-4 mr-2" />
                Property Type Check
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => handleAddNode('conditionNode', 'Time Delay', 'Waits for a specified time period', <Settings className="h-4 w-4" />)}
              >
                <Settings className="h-4 w-4 mr-2" />
                Time Delay
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => handleAddNode('conditionNode', 'Email Opened Check', 'Branches based on if email was opened', <Mail className="h-4 w-4" />)}
              >
                <Mail className="h-4 w-4 mr-2" />
                Email Opened Check
              </Button>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Main Flow Designer Area */}
        <div className="flex-1">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            fitView
          >
            <Background />
            <Controls />
            <MiniMap />
          </ReactFlow>
        </div>
      </div>
    </div>
  );
};

export default FlowDesigner;
