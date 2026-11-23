import type { Component } from "vue";
import SimplePreview from "./Simple.vue";
import ProfessionalPreview from "./Professional.vue";
import ModernPreview from "./Modern.vue";

export interface Theme {
  id: string;
  name: string;
  description: string;
  component: Component;
}

export const themes: Theme[] = [
  {
    id: "modern",
    name: "Modern",
    description: "Two-column layout with crisp hierarchy and accent colors",
    component: ModernPreview,
  },
  {
    id: "simple",
    name: "Simple",
    description: "Clean and straightforward ATS-friendly single-column format",
    component: SimplePreview,
  },
  {
    id: "professional",
    name: "Professional",
    description: "Bold, high-contrast executive layout with structured sections",
    component: ProfessionalPreview,
  },
];

export function getTheme(themeId: string): Theme | undefined {
  return themes.find((theme) => theme.id === themeId);
}

export function getDefaultTheme(): Theme {
  // Simple theme as default
  const defaultTheme = themes.find((theme) => theme.id === "simple");
  if (!defaultTheme) {
    throw new Error("Default theme not found");
  }
  return defaultTheme;
}
