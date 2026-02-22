/**
 * AI Service
 * Handles communication with the backend AI endpoints (OpenAI)
 */

export async function generateRoadmap(
  targetRole: string,
  resumeText: string,
  authenticatedFetch?: (url: string, init?: RequestInit) => Promise<Response>
) {
  const request = authenticatedFetch ?? fetch;
  const response = await request("/api/ai/generate-roadmap", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ targetRole, resumeText }),
  });

  if (!response.ok) {
    throw new Error("Failed to generate roadmap");
  }

  const data = await response.json();
  return data.roadmap;
}

export async function getInterviewResponse(
  message: string,
  history: { role: string; content: string }[],
  targetRole: string,
  resumeText: string,
  authenticatedFetch?: (url: string, init?: RequestInit) => Promise<Response>
) {
  const request = authenticatedFetch ?? fetch;
  const response = await request("/api/ai/interview-chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, history, targetRole, resumeText }),
  });

  if (!response.ok) {
    throw new Error("Failed to get interview response");
  }

  const data = await response.json();
  return data.response;
}
