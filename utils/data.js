import useSWR from "swr";

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

export async function putAsUser(uri, payload = {}) {
  const authToken = await getAuthToken();
  const response = await fetch(uri, {
    method: "PUT",
    body: JSON.stringify(payload),
    headers: {
      Authorization: `Bearer ${authToken}`,
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();
  return data;
}

export async function getAsUser(uri) {
  const authToken = await getAuthToken();
  const response = await fetch(uri, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${authToken}`,
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();
  return data;
}

export function useFriendRequests() {
  const { data, error, isLoading } = useSWR(
    "/api/v1/friendrequests",
    getAsUser
  );

  return {
    friendRequests: data?.friendRequests,
    error,
    loading: isLoading,
  };
}

export function useFriends() {
  const { data, error, isLoading } = useSWR("/api/v1/friends", getAsUser);

  return {
    friends: data?.friends,
    error,
    loading: isLoading,
  };
}
