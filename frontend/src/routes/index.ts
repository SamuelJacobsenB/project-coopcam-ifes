import {
  CalendarMonthPage,
  CalendarPage,
  DashboardPage,
  LoginPage,
  UsersPage,
} from "../pages";

export const routes = [
  { path: "/", label: "Home", element: DashboardPage },
  { path: "/login", label: "Login", element: LoginPage },
  { path: "/users", label: "Usuários", element: UsersPage },
  { path: "/users/create", label: "Criar Usuário", element: UsersPage },
  { path: "/calendar", label: "Calendário", element: CalendarPage },
  { path: "/calendar/:month", label: "Mês", element: CalendarMonthPage },
] as const;

export const navRoutes = routes.filter(
  ({ path }) =>
    path !== "/login" && path !== "/users/create" && path !== "/calendar/:month"
);
