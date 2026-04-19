import type { Component } from 'vue';
import SimplePreview from './Simple.vue';
import ModernPreview from './Modern.vue';
import ProfessionalPreview from './Professional.vue';

export interface Theme {
  id: string;
  name: string;
  description: string;
  component: Component;
}

export const themes: Theme[] = [
  {
    id: 'simple',
    name: 'Simple',
    description: 'Clean and straightforward ATS-friendly format',
    component: SimplePreview,
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Clean, sans-serif design with a sidebar and timeline',
    component: ModernPreview,
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Bold, high-contrast design with efficient space usage',
    component: ProfessionalPreview,
  }
];

export function getTheme(themeId: string): Theme | undefined {
  return themes.find((theme) => theme.id === themeId);
}

export function getDefaultTheme(): Theme {
  // Simple theme as default
  const defaultTheme = themes.find((theme) => theme.id === 'simple');
  if (!defaultTheme) {
    throw new Error('Default theme not found');
  }
  return defaultTheme;
}

