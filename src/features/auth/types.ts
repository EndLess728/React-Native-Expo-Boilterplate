// Extend with real fields as the app grows (id, displayName, avatarUrl, …).
// Avoid an index signature here — `[key: string]: unknown` would let any
// property compile, defeating the point of having a typed user object.
export interface User {
  email: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}
