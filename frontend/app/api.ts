const API_BASE = "http://192.168.25.57:8080/api";

export const testConnection = async (): Promise<string> => {
  try {
    const response = await fetch(`${API_BASE}/test`);
    if (!response.ok) {
      return `HTTP error! status: ${response.status}`;
    }

    const text = await response.text();
    return text;
  } catch (error) {
    console.error("Full error:", error);
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
