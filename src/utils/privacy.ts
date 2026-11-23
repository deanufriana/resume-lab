import type { Resume } from "../types/resume";

/**
 * Returns a copy of the resume with direct contact details stripped when
 * Upwork privacy mode (`meta.hideContact`) is enabled.
 */
export function stripContactInfo(resume: Resume): Resume {
  if (!resume.meta?.hideContact || !resume.basics) {
    return resume;
  }

  return {
    ...resume,
    basics: {
      ...resume.basics,
      email: "",
      phone: "",
      url: "",
      profiles: [],
      location: resume.basics.location
        ? { ...resume.basics.location, address: "" }
        : resume.basics.location,
    },
  };
}
