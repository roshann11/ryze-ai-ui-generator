// Core types for the AI UI Generator system

export interface UIComponent {
  id: string;
  type: ComponentType;
  props: Record<string, any>;
  children?: UIComponent[];
  content?: string;
}

export type ComponentType =
  | 'Button'
  | 'Card'
  | 'Input'
  | 'Table'
  | 'Modal'
  | 'Sidebar'
  | 'Navbar'
  | 'Chart';

export interface Plan {
  id: string;
  timestamp: number;
  layout: LayoutStructure;
  components: ComponentSelection[];
  reasoning: string;
}

export interface LayoutStructure {
  type: 'single' | 'split' | 'grid' | 'sidebar';
  sections: LayoutSection[];
}

export interface LayoutSection {
  id: string;
  area: string;
  components: string[];
}

export interface ComponentSelection {
  componentType: ComponentType;
  purpose: string;
  props: Record<string, any>;
}

export interface GeneratedCode {
  id: string;
  planId: string;
  code: string;
  timestamp: number;
  explanation: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  metadata?: {
    planId?: string;
    codeId?: string;
  };
}

export interface GenerationHistory {
  id: string;
  userPrompt: string;
  plan: Plan;
  code: GeneratedCode;
  timestamp: number;
}

export interface AgentStep {
  step: 'planner' | 'generator' | 'explainer';
  input: string;
  output: any;
  timestamp: number;
}