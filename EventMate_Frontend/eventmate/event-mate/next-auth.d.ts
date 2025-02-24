import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user?: {
      id?: string;
      token?: string;
      fullname?: string;
      avatar?: string;
      googleId?: string;
      role?: string;
    } & DefaultSession["user"];
  }
}
