import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: [
    "/",
    "/tasks",
    "/focus",
    "/analytics",
    "/settings",
    "/profile"
  ]
};
