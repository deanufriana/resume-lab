import type { Resume } from '../types/resume';

const STORAGE_KEY = 'resume-lab-data';

export function saveResumeToStorage(resume: Resume): void {
  try {
    const jsonString = JSON.stringify(resume);
    localStorage.setItem(STORAGE_KEY, jsonString);
  } catch (error) {
    console.error('Error saving resume to localStorage:', error);
    throw error;
  }
}

export function loadResumeFromStorage(): Resume | null {
  try {
    const jsonString = localStorage.getItem(STORAGE_KEY);
    if (!jsonString) return null;
    
    const resume = JSON.parse(jsonString) as Resume;
    return resume;
  } catch (error) {
    console.error('Error loading resume from localStorage:', error);
    return null;
  }
}

export function clearResumeFromStorage(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing resume from localStorage:', error);
  }
}

