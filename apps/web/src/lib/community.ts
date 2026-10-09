import { request } from "./api";
export type Member = { id: string; username: string };
export type Workspace = {
  id: string;
  name: string;
  area: string;
  owner: boolean;
};
export type Board = Workspace & {
  members: Member[];
  issues: {
    id: string;
    public_id: string;
    title: string;
    status: string;
    assignee_id: string | null;
    assignee: string | null;
  }[];
  proposals: {
    id: string;
    issue_id: string;
    public_id: string;
    note: string;
    status: string;
    observation_id: string;
    proposer_id: string;
    approvals: number;
  }[];
};
export type InboxItem = {
  id: string;
  message: string;
  due_at: string;
  read_at: string | null;
  public_id: string | null;
};
export const communityApi = {
  me: () => request<{ account: Member | null }>("/v1/account/me"),
  auth: (
    mode: "signup" | "login" | "recover",
    data: { username: string; password: string; recovery?: string },
  ) =>
    request<{ account: Member; recovery?: string }>(`/v1/account/${mode}`, {
      method: "POST",
      json: data,
    }),
  logout: (all = false) =>
    request(`/v1/account/${all ? "logout-all" : "logout"}`, {
      method: "POST",
      json: {},
    }),
  list: () => request<{ items: Workspace[] }>("/v1/community/list"),
  create: (name: string, area: string) =>
    request<Workspace>("/v1/community/create", {
      method: "POST",
      json: { name, area },
    }),
  join: (code: string) =>
    request<{ id: string }>("/v1/community/join", {
      method: "POST",
      json: { code },
    }),
  board: (id: string) => request<Board>(`/v1/community/${id}`),
  action: <T = unknown>(id: string, action: string, json: unknown = {}) =>
    request<T>(`/v1/community/${id}/${action}`, { method: "POST", json }),
  inbox: () => request<{ items: InboxItem[] }>("/v1/account/notifications"),
  read: (id: string) =>
    request("/v1/account/notifications/read", { method: "POST", json: { id } }),
  reminder: (issueId: string, dueAt: string) =>
    request("/v1/account/reminders", {
      method: "POST",
      json: { issueId, dueAt },
    }),
  subscribe: (issueId: string, enabled: boolean) =>
    request("/v1/account/subscriptions", {
      method: "POST",
      json: { issueId, enabled },
    }),
};
