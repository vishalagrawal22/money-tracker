import { getAuthToken } from "./auth/client";

export async function postAsUser(uri, payload = {}) {
  const authToken = await getAuthToken();
  const response = await fetch(uri, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      Authorization: `Bearer ${authToken}`,
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();
  return data;
}
