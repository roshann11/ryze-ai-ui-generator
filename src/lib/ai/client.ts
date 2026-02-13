// Mock AI Client - No API Key Required
// This simulates AI responses for testing without using actual API credits

export const AI_CONFIG = {
  model: 'mock-ai-v1',
  maxTokens: 4000,
  temperature: 0.3,
};

// Mock delay to simulate API call
const mockDelay = () => new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400));

export async function callClaude(
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  console.log('🧪 MOCK AI - Simulating API call (no credits needed)');
  console.log('System prompt type:', systemPrompt.substring(0, 50) + '...');
  console.log('User request:', userPrompt.substring(0, 100) + '...');

  // Simulate network delay
  await mockDelay();

  // Detect which agent is calling based on system prompt
  if (systemPrompt.includes('Planning Agent')) {
    return generateMockPlan(userPrompt);
  } else if (systemPrompt.includes('Code Generator')) {
    return generateMockCode(userPrompt);
  } else if (systemPrompt.includes('Explanation Agent')) {
    return generateMockExplanation(userPrompt);
  }

  return 'Mock AI response';
}

// Mock Planner Agent
function generateMockPlan(userRequest: string): string {
  console.log('📋 Mock Planner: Creating plan...');

  const lowerRequest = userRequest.toLowerCase();
  
  // Detect what components to use based on user request
  const needsNavbar = lowerRequest.includes('navbar') || lowerRequest.includes('navigation');
  const needsSidebar = lowerRequest.includes('sidebar') || lowerRequest.includes('side panel');
  const needsTable = lowerRequest.includes('table') || lowerRequest.includes('data') || lowerRequest.includes('list');
  const needsChart = lowerRequest.includes('chart') || lowerRequest.includes('graph') || lowerRequest.includes('dashboard');
  const needsModal = lowerRequest.includes('modal') || lowerRequest.includes('dialog') || lowerRequest.includes('popup');
  const needsForm = lowerRequest.includes('form') || lowerRequest.includes('input') || lowerRequest.includes('login');

  const components = [];
  let layoutType = 'single';

  // Build component list based on detected needs
  if (needsNavbar) {
    components.push({
      id: 'navbar-1',
      componentType: 'Navbar',
      purpose: 'Main navigation bar',
      props: {
        brand: 'My App',
        variant: 'light'
      }
    });
  }

  if (needsSidebar) {
    layoutType = 'sidebar';
    components.push({
      id: 'sidebar-1',
      componentType: 'Sidebar',
      purpose: 'Side navigation panel',
      props: {
        width: 'md',
        position: 'left'
      }
    });
  }

  if (needsTable) {
    components.push({
      id: 'table-1',
      componentType: 'Table',
      purpose: 'Display data in tabular format',
      props: {
        striped: true,
        hoverable: true
      }
    });
  }

  if (needsChart) {
    components.push({
      id: 'chart-1',
      componentType: 'Chart',
      purpose: 'Visualize data',
      props: {
        type: 'bar',
        title: 'Data Overview'
      }
    });
  }

  if (needsForm) {
    components.push({
      id: 'card-1',
      componentType: 'Card',
      purpose: 'Form container',
      props: {
        title: lowerRequest.includes('login') ? 'Login' : 'Form',
        padding: 'lg'
      }
    });
    components.push({
      id: 'input-1',
      componentType: 'Input',
      purpose: 'Email input',
      props: {
        label: 'Email',
        type: 'email',
        placeholder: 'Enter your email',
        fullWidth: true
      }
    });
    if (lowerRequest.includes('password') || lowerRequest.includes('login')) {
      components.push({
        id: 'input-2',
        componentType: 'Input',
        purpose: 'Password input',
        props: {
          label: 'Password',
          type: 'password',
          placeholder: 'Enter your password',
          fullWidth: true
        }
      });
    }
    components.push({
      id: 'button-1',
      componentType: 'Button',
      purpose: 'Submit button',
      props: {
        variant: 'primary',
        children: 'Submit',
        fullWidth: true
      }
    });
  }

  if (needsModal) {
    components.push({
      id: 'modal-1',
      componentType: 'Modal',
      purpose: 'Modal dialog',
      props: {
        title: 'Settings',
        size: 'md'
      }
    });
  }

  // If no specific components detected, create a default UI
  if (components.length === 0) {
    components.push(
      {
        id: 'card-1',
        componentType: 'Card',
        purpose: 'Main content container',
        props: {
          title: 'Welcome',
          description: 'Generated UI based on your request'
        }
      },
      {
        id: 'button-1',
        componentType: 'Button',
        purpose: 'Primary action button',
        props: {
          variant: 'primary',
          children: 'Get Started'
        }
      }
    );
  }

  const plan = {
    layout: {
      type: layoutType,
      sections: [
        {
          id: 'main',
          area: 'main',
          components: components.map(c => c.id)
        }
      ]
    },
    components: components,
    reasoning: `Based on your request for "${userRequest}", I've designed a ${layoutType} layout using ${components.length} component(s). ${
      needsForm ? 'The form includes input fields and a submit button. ' : ''
    }${needsTable ? 'A table is included to display data. ' : ''}${
      needsChart ? 'A chart component will visualize the data. ' : ''
    }This layout provides a clean, functional interface.`
  };

  return JSON.stringify(plan, null, 2);
}

// Mock Generator Agent
function generateMockCode(userRequest: string): string {
  console.log('⚙️ Mock Generator: Creating code...');

  const lowerRequest = userRequest.toLowerCase();
  
  const needsNavbar = lowerRequest.includes('navbar');
  const needsSidebar = lowerRequest.includes('sidebar');
  const needsTable = lowerRequest.includes('table') || lowerRequest.includes('data');
  const needsChart = lowerRequest.includes('chart') || lowerRequest.includes('dashboard');
  const needsModal = lowerRequest.includes('modal');
  const needsForm = lowerRequest.includes('form') || lowerRequest.includes('login') || lowerRequest.includes('input');

  let uiImports = [];

  if (needsNavbar) uiImports.push('Navbar');
  if (needsSidebar) uiImports.push('Sidebar');
  if (needsTable) uiImports.push('Table');
  if (needsChart) uiImports.push('Chart');
  if (needsModal) uiImports.push('Modal');
  if (needsForm) {
    uiImports.push('Card', 'Input', 'Button');
  } else if (uiImports.length === 0) {
    uiImports.push('Card', 'Button');
  }

  // Remove duplicates
  uiImports = [...new Set(uiImports)];

  let code = `\`\`\`tsx
import React, { useState } from 'react';
import { ${uiImports.join(', ')} } from '@/components/ui';

export default function GeneratedUI() {
  const [isModalOpen, setIsModalOpen] = useState(false);`;

  if (needsForm) {
    code += `
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const handleSubmit = () => {
    alert(\`Submitted! Email: \${email}\`);
  };`;
  }

  if (needsTable) {
    code += `
  
  const tableData = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'User' },
  ];

  const columns = [
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    { key: 'role', header: 'Role' },
  ];`;
  }

  if (needsChart) {
    code += `

  const chartData = [
    { label: 'Jan', value: 65 },
    { label: 'Feb', value: 78 },
    { label: 'Mar', value: 90 },
    { label: 'Apr', value: 81 },
    { label: 'May', value: 95 },
  ];`;
  }

  code += `

  return (
    <div className="min-h-screen bg-neutral-50">`;

  if (needsNavbar) {
    code += `
      <Navbar brand="My App" variant="light">
        <Button variant="ghost" onClick={() => setIsModalOpen(true)}>
          Settings
        </Button>
      </Navbar>`;
  }

  code += `
      <div className="container mx-auto p-8">`;

  if (needsForm) {
    code += `
        <div className="max-w-md mx-auto">
          <Card title="${lowerRequest.includes('login') ? 'Login' : 'Form'}" padding="lg">
            <div className="space-y-4">
              <Input
                label="Email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={setEmail}
                fullWidth
              />`;
    
    if (lowerRequest.includes('password') || lowerRequest.includes('login')) {
      code += `
              <Input
                label="Password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={setPassword}
                fullWidth
              />`;
    }

    code += `
              <Button 
                variant="primary" 
                fullWidth
                onClick={handleSubmit}
              >
                Submit
              </Button>
            </div>
          </Card>
        </div>`;
  }

  if (needsTable) {
    code += `
        <Card title="Data Table" padding="md">
          <Table 
            columns={columns} 
            data={tableData}
            striped
            hoverable
          />
        </Card>`;
  }

  if (needsChart) {
    code += `
        <div className="mt-6">
          <Chart 
            type="bar"
            data={chartData}
            title="Monthly Statistics"
            height={300}
          />
        </div>`;
  }

  if (!needsForm && !needsTable && !needsChart) {
    code += `
        <div className="max-w-md mx-auto">
          <Card 
            title="Welcome" 
            description="This UI was generated based on your request"
            padding="lg"
          >
            <Button 
              variant="primary"
              onClick={() => alert('Button clicked!')}
            >
              Get Started
            </Button>
          </Card>
        </div>`;
  }

  if (needsModal) {
    code += `

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Settings"
          size="md"
        >
          <div className="space-y-4">
            <p className="text-neutral-600">Configure your settings here.</p>
            <Button 
              variant="primary" 
              onClick={() => setIsModalOpen(false)}
              fullWidth
            >
              Close
            </Button>
          </div>
        </Modal>`;
  }

  code += `
      </div>
    </div>
  );
}
\`\`\``;

  return code;
}

// Mock Explainer Agent
function generateMockExplanation(userRequest: string): string {
  console.log('💬 Mock Explainer: Creating explanation...');

  const lowerRequest = userRequest.toLowerCase();
  
  const components = [];
  if (lowerRequest.includes('navbar')) components.push('navigation bar');
  if (lowerRequest.includes('sidebar')) components.push('sidebar');
  if (lowerRequest.includes('table')) components.push('data table');
  if (lowerRequest.includes('chart')) components.push('chart');
  if (lowerRequest.includes('modal')) components.push('modal');
  if (lowerRequest.includes('form') || lowerRequest.includes('input')) components.push('form with inputs');

  const hasMultipleComponents = components.length > 1;

  let explanation = `I've created a ${hasMultipleComponents ? 'comprehensive' : 'clean and simple'} user interface based on your request. `;

  if (components.length > 0) {
    explanation += `The design includes ${components.length === 1 ? 'a' : ''} ${components.join(', ')
      .replace(/, ([^,]*)$/, ' and $1')}. `;
  }

  if (lowerRequest.includes('login') || lowerRequest.includes('form')) {
    explanation += `The form provides a straightforward way for users to input their information with clearly labeled fields and a prominent submit button. `;
  }

  if (lowerRequest.includes('table')) {
    explanation += `The table displays data in an organized, easy-to-read format with hoverable rows for better user experience. `;
  }

  if (lowerRequest.includes('dashboard')) {
    explanation += `The dashboard layout gives users a comprehensive overview of their data with visual charts and organized sections. `;
  }

  explanation += `All components use our design system's consistent styling to ensure a professional, cohesive appearance. The interface is responsive and user-friendly.`;

  return explanation;
}

// Mock anthropic object for compatibility
export const anthropic = {
  messages: {
    create: async () => ({ content: [{ type: 'text', text: 'mock' }] })
  }
};