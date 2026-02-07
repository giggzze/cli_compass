/**
 * Template Parser for Command Variables
 *
 * Syntax: {{variable_name}} or {{variable_name:default_value}}
 *
 * Examples:
 * - docker exec -it {{container}} bash
 * - ssh {{user:root}}@{{host}}
 * - curl -X {{method:GET}} {{url}}
 */

export interface TemplateVariable {
  name: string;
  defaultValue?: string;
  fullMatch: string;
  index: number;
}

export interface ParsedTemplate {
  hasVariables: boolean;
  variables: TemplateVariable[];
  originalTemplate: string;
}

// Regex to match {{variable}} or {{variable:default}}
const VARIABLE_REGEX = /\{\{([^}:]+)(?::([^}]*))?\}\}/g;

/**
 * Parse a template string and extract all variables
 */
export function parseTemplate(template: string): ParsedTemplate {
  const variables: TemplateVariable[] = [];
  const seen = new Set<string>();

  let match;
  while ((match = VARIABLE_REGEX.exec(template)) !== null) {
    const name = match[1].trim();
    const defaultValue = match[2]?.trim();

    // Only add unique variables (by name)
    if (!seen.has(name)) {
      seen.add(name);
      variables.push({
        name,
        defaultValue,
        fullMatch: match[0],
        index: match.index,
      });
    }
  }

  return {
    hasVariables: variables.length > 0,
    variables,
    originalTemplate: template,
  };
}

/**
 * Replace variables in a template with their values
 */
export function applyTemplate(
  template: string,
  values: Record<string, string>
): string {
  return template.replace(VARIABLE_REGEX, (match, name, defaultValue) => {
    const trimmedName = name.trim();
    const value = values[trimmedName];

    if (value !== undefined && value !== "") {
      return value;
    }

    // Use default value if provided
    if (defaultValue !== undefined) {
      return defaultValue.trim();
    }

    // Return original match if no value provided
    return match;
  });
}

/**
 * Check if a string contains template variables
 */
export function hasTemplateVariables(text: string): boolean {
  VARIABLE_REGEX.lastIndex = 0; // Reset regex state
  return VARIABLE_REGEX.test(text);
}

/**
 * Get variable names from a template (unique list)
 */
export function getVariableNames(template: string): string[] {
  const parsed = parseTemplate(template);
  return parsed.variables.map((v) => v.name);
}

/**
 * Validate a template (check for malformed variables)
 */
export function validateTemplate(template: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Check for unclosed braces
  const openCount = (template.match(/\{\{/g) || []).length;
  const closeCount = (template.match(/\}\}/g) || []).length;

  if (openCount !== closeCount) {
    errors.push("Mismatched braces: ensure all {{ have matching }}");
  }

  // Check for empty variable names
  const emptyVars = template.match(/\{\{\s*\}\}/g);
  if (emptyVars) {
    errors.push("Empty variable names found");
  }

  // Check for nested braces (not supported)
  if (/\{\{[^}]*\{\{/.test(template)) {
    errors.push("Nested braces are not supported");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// Storage key for recent variable values
const RECENT_VALUES_KEY = "cli-compass-template-values";

/**
 * Get recent values for a variable from localStorage
 */
export function getRecentValues(variableName: string): string[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(RECENT_VALUES_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      return data[variableName] || [];
    }
  } catch {
    // Ignore errors
  }

  return [];
}

/**
 * Save a value to recent values for a variable
 */
export function saveRecentValue(variableName: string, value: string): void {
  if (typeof window === "undefined" || !value.trim()) return;

  try {
    const stored = localStorage.getItem(RECENT_VALUES_KEY);
    const data = stored ? JSON.parse(stored) : {};

    const existing = data[variableName] || [];
    const filtered = existing.filter((v: string) => v !== value);
    data[variableName] = [value, ...filtered].slice(0, 5); // Keep last 5

    localStorage.setItem(RECENT_VALUES_KEY, JSON.stringify(data));
  } catch {
    // Ignore errors
  }
}

/**
 * Clear all recent values
 */
export function clearRecentValues(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(RECENT_VALUES_KEY);
}
