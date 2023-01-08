import useSWR from "swr";

import { getAuthToken, useUser } from "./auth/client";

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

export function useCurrentUser() {
  const { data, error, isLoading } = useSWR("/api/v1/currentuser", getAsUser);
  return {
    currentUser: data?.currentUser,
    error,
    loading: isLoading,
  };
}

export function useUserOptions() {
  const {
    friends,
    error: friendsError,
    loading: friendsLoading,
  } = useFriends();

  const {
    currentUser,
    error: currentUserError,
    loading: currentUserLoading,
  } = useCurrentUser();

  const users = currentUser && friends ? [currentUser].concat(friends) : [];
  const userOptions = users.map((user) => ({
    value: user._id,
    label: user.email,
  }));

  return {
    userOptions,
    loading: currentUserLoading || friendsLoading,
    error: friendsError ? friendsError : currentUserError,
  };
}

export function useTransactions() {
  const { data, error, isLoading } = useSWR("/api/v1/transactions", getAsUser);
  return {
    transactions: data?.transactions,
    error,
    loading: isLoading,
  };
}
