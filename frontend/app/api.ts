// ✅ CORRECT - Frontend calls Spring Boot backend
const API_BASE = "http://localhost:8080/api";

export const testConnection = async (): Promise<string> => {
  try {
    const response = await fetch(`${API_BASE}/test`);
    return await response.text();
  } catch (error) {
    return `Connection failed: ${error.message}`;
  }
};

export const createLocation = async (location: any) => {
  const response = await fetch(`${API_BASE}/locations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(location),
  });
  return await response.json();
};
