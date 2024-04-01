"use client";

import { SessionProvider } from "next-auth/react";

const AuthProvider = ({ children, session }) => (
  <SessionProvider session={session}>{children}</SessionProvider>
);

export default AuthProvider;
