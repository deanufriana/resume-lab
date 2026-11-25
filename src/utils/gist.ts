import type { Resume } from "../types/resume";

interface GistFile {
  filename?: string;
  content?: string;
  truncated?: boolean;
  raw_url?: string;
}

interface GistApiResponse {
  files?: Record<string, GistFile>;
}

const GIST_ID_PATTERN = /^[a-f0-9]{16,40}$/i;
const GIST_HOSTS = new Set(["gist.github.com", "gist.githubusercontent.com", "api.github.com"]);

/**
 * Extracts a GitHub Gist ID from a bare ID or a Gist/API URL.
 */
export function parseGistId(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  if (GIST_ID_PATTERN.test(trimmed)) {
    return trimmed;
  }

  let candidate = trimmed;
  if (/^(gist\.github\.com|gist\.githubusercontent\.com|api\.github\.com)\//i.test(candidate)) {
    candidate = `https://${candidate}`;
  }

  let url: URL;
  try {
    url = new URL(candidate);
  } catch {
    return null;
  }

  const host = url.hostname.toLowerCase();
  if (!GIST_HOSTS.has(host)) {
    return null;
  }

  const segments = url.pathname.split("/").filter(Boolean);
  if (host === "api.github.com") {
    if (segments[0] === "gists" && segments[1] && GIST_ID_PATTERN.test(segments[1])) {
      return segments[1];
    }
    return null;
  }

  for (const segment of segments) {
    if (GIST_ID_PATTERN.test(segment)) {
      return segment;
    }
  }

  return null;
}

/**
 * Reads the `?gist=` query parameter from either `location.search` or hash-router `location.hash`.
 */
export function getGistParamFromLocation(search: string, hash: string): string | null {
  const fromSearch = new URLSearchParams(search).get("gist")?.trim();
  if (fromSearch) return fromSearch;

  const queryIndex = hash.indexOf("?");
  if (queryIndex !== -1) {
    const fromHash = new URLSearchParams(hash.slice(queryIndex + 1)).get("gist")?.trim();
    if (fromHash) return fromHash;
  }

  return null;
}

/**
 * Fetches and parses a JSON Resume object from a public or secret GitHub Gist.
 */
export async function fetchResumeFromGist(
  input: string,
  fetchImpl: typeof fetch = fetch,
): Promise<{ resume: Resume; gistId: string; filename: string }> {
  const gistId = parseGistId(input);
  if (!gistId) {
    throw new Error("Invalid GitHub Gist URL or ID.");
  }

  const response = await fetchImpl(`https://api.github.com/gists/${gistId}`, {
    headers: { Accept: "application/vnd.github+json" },
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("Gist not found. Make sure the ID is correct and the Gist is accessible.");
    }
    if (response.status === 403) {
      throw new Error("GitHub API rate limit exceeded. Please try again later.");
    }
    throw new Error(`Failed to fetch Gist (HTTP ${response.status}).`);
  }

  const data = (await response.json()) as GistApiResponse;
  const entries = Object.entries(data.files ?? {});
  if (entries.length === 0) {
    throw new Error("No JSON file found in this Gist.");
  }

  const preferred =
    entries.find(([key, file]) => (file.filename ?? key).toLowerCase() === "resume.json") ??
    entries.find(([key, file]) => (file.filename ?? key).toLowerCase().endsWith(".json"));

  if (!preferred) {
    throw new Error("No JSON file found in this Gist.");
  }

  const [selectedKey, selectedFile] = preferred;
  const filename = selectedFile.filename || selectedKey;

  let rawContent = selectedFile.content ?? "";
  if (selectedFile.truncated && selectedFile.raw_url) {
    const rawResponse = await fetchImpl(selectedFile.raw_url);
    if (!rawResponse.ok) {
      throw new Error(`Failed to fetch truncated Gist file (HTTP ${rawResponse.status}).`);
    }
    rawContent = await rawResponse.text();
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(rawContent);
  } catch {
    throw new Error(`"${filename}" does not contain valid JSON.`);
  }

  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error(`"${filename}" root JSON value must be an object.`);
  }

  return {
    resume: parsed as Resume,
    gistId,
    filename,
  };
}
