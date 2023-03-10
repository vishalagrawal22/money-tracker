import { useMemo } from "react";
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

export async function deleteAsUser(uri) {
  const authToken = await getAuthToken();
  const response = await fetch(uri, {
    method: "DELETE",
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

  const currentUserData = useMemo(() => {
    return {
      currentUser: data?.currentUser,
      error,
      loading: isLoading,
    };
  }, [data, error, isLoading]);

  return currentUserData;
}

export function useSpent() {
  const { user } = useUser();
  const { transactions, loading, error } = useTransactions();

  const spent = useMemo(() => {
    let spent = 0;
    if (user) {
      const payableTransactions = transactions.filter((transaction) => {
        if (transaction.payer.uid === user.uid) {
          return transaction.includePayerInSplit;
        } else {
          return true;
        }
      });

      spent = payableTransactions.reduce(
        (total, transaction) => total + transaction.split,
        0
      );
    }
    return spent;
  }, [user, transactions]);

  return {
    spent,
    loading,
    error,
  };
}

export function useBudget() {
  const { currentUser, loading, error } = useCurrentUser();

  return {
    budget: currentUser?.budget,
    loading,
    error,
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

  const transactionsData = useMemo(() => {
    return {
      transactions: data?.transactions || [],
      error,
      loading: isLoading,
    };
  }, [data, error, isLoading]);

  return transactionsData;
}

export function useTransaction(id) {
  const { data, error, isLoading } = useSWR(
    `/api/v1/transactions/${id}`,
    getAsUser
  );
  return {
    transaction: data?.transaction,
    error,
    loading: isLoading,
  };
}

export function getTransactionStatus(transaction) {
  const totalUsers = transaction.users.length;
  const approvals = transaction.approvals.length;
  const rejections = transaction.rejections.length;
  if (approvals === totalUsers && rejections === 0) {
    return "approved";
  } else if (rejections > 0) {
    return "rejected";
  } else {
    return "pending";
  }
}
