import { getAuthToken } from "./auth/client";

export const ISSUE_IN_NETWORK_RESPONSE =
  "an issue occured in network when making a request";

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

  if (!response.ok) {
    throw ISSUE_IN_NETWORK_RESPONSE;
  }

  const data = await response.json();
  return data;
}
