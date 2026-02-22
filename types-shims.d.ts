declare module "react-router-dom" {
  import * as React from "react";
  export const Link: React.ComponentType<any>;
  export const Navigate: React.ComponentType<any>;
  export const Route: React.ComponentType<any>;
  export const Routes: React.ComponentType<any>;
  export const BrowserRouter: React.ComponentType<any>;
  export const useNavigate: () => (to: string) => void;
  export const useLocation: () => { pathname: string };
}

declare module "@clerk/clerk-react" {
  import * as React from "react";
  export const SignIn: React.ComponentType<any>;
  export const SignUp: React.ComponentType<any>;
  export const UserButton: React.ComponentType<any>;
  export const useAuth: () => { getToken: () => Promise<string | null> };
  export const useUser: () => { isLoaded: boolean; isSignedIn: boolean; user: any };
}

declare module "clsx" {
  export type ClassValue = string | number | null | boolean | undefined | ClassValue[] | Record<string, boolean>;
  export function clsx(...inputs: ClassValue[]): string;
}

declare module "tailwind-merge" {
  export function twMerge(...classes: string[]): string;
}
