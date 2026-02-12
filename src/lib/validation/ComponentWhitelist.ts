// Whitelist of allowed components - CRITICAL for determinism
export const ALLOWED_COMPONENTS = [
  'Button',
  'Card',
  'Input',
  'Table',
  'Modal',
  'Sidebar',
  'Navbar',
  'Chart',
] as const;

export type AllowedComponent = typeof ALLOWED_COMPONENTS[number];


export function validateComponentUsage(code: string): {
  isValid: boolean;
  violations: string[];
} {
  const violations: string[] = [];

  
  if (code.includes('style={{') || code.includes('style={')) {
    violations.push('Inline styles are not allowed');
  }

  
  if (code.includes('className={`') && code.match(/className={\`[^}]*\$\{/)) {
    violations.push('Dynamic className generation is not allowed');
  }


  const componentRegex = /<([A-Z][a-zA-Z]*)/g;
  const usedComponents = new Set<string>();
  let match;

  while ((match = componentRegex.exec(code)) !== null) {
    usedComponents.add(match[1]);
  }

  
  usedComponents.forEach((component) => {
    if (!ALLOWED_COMPONENTS.includes(component as AllowedComponent)) {
      violations.push(`Component "${component}" is not in the allowed list`);
    }
  });

  return {
    isValid: violations.length === 0,
    violations,
  };
}


export function sanitizeUserInput(input: string): string {
  
  const sanitized = input
    .replace(/system:/gi, '')
    .replace(/assistant:/gi, '')
    .replace(/```/g, '')
    .trim();

  return sanitized;
}