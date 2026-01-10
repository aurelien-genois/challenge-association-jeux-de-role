import type { User } from "../../prisma/generated/prisma/client.js";
import { Role } from "../../prisma/generated/prisma/client.js";
import bcrypt from "bcrypt";
import { generateAuthenticationTokens } from "../../src/utils/token.js";

export const apiBaseUrl = `http://localhost:7357`;

const fakeAdminUser = await buildFakeAdminUser();

export const adminAuthenticatedRequester =
  buildAuthenticatedRequester(fakeAdminUser);

export async function buildFakeAdminUser(
  user: Partial<User> = {}
): Promise<User> {
  return {
    id: 234,
    email: `user${Math.random()}${Date.now()}@ajdr.com`,
    name: "Fake Administrator",
    password: await bcrypt.hash("123456789azerty", 10),
    role: Role.admin, // from enum Role
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
    ...user, // if not empty, will overide default values
  };
}

// TODO buildFakeMemberUser

export function buildAuthenticatedRequester(user: User) {
  const { accessToken } = generateAuthenticationTokens(user); // log in user

  return {
    async get(endpoint: string, options: RequestInit = {}) {
      return fetch(`${apiBaseUrl}${endpoint}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken.token}`,
          "Content-Type": "application/json",
          ...(options.headers || {}),
        },
        ...options,
      });
    },
    async post(endpoint: string, options: RequestInit = {}) {
      return fetch(`${apiBaseUrl}${endpoint}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken.token}`,
          "Content-Type": "application/json",
          ...(options.headers || {}),
        },
        ...options,
      });
    },
    async patch(endpoint: string, options: RequestInit = {}) {
      return fetch(`${apiBaseUrl}${endpoint}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken.token}`,
          "Content-Type": "application/json",
          ...(options.headers || {}),
        },
        ...options,
      });
    },
    async delete(endpoint: string, options: RequestInit = {}) {
      return fetch(`${apiBaseUrl}${endpoint}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken.token}`,
          "Content-Type": "application/json",
          ...(options.headers || {}),
        },
        ...options,
      });
    },
  };
}

export const unauthenticatedRequester = {
  async get(endpoint: string, options: RequestInit = {}) {
    return fetch(`${apiBaseUrl}${endpoint}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      ...options,
    });
  },
  async post(endpoint: string, options: RequestInit = {}) {
    return fetch(`${apiBaseUrl}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      ...options,
    });
  },
  async patch(endpoint: string, options: RequestInit = {}) {
    return fetch(`${apiBaseUrl}${endpoint}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      ...options,
    });
  },
  async delete(endpoint: string, options: RequestInit = {}) {
    return fetch(`${apiBaseUrl}${endpoint}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      ...options,
    });
  },
};
