import {
  CalendarMonthPage,
  CalendarPage,
  DashboardPage,
  LoginPage,
  UsersPage,
} from "../pages";

export const routes = [
  { path: "/", element: DashboardPage },
  { path: "/:bus-trip-stats", element: DashboardPage },
  { path: "/login", element: LoginPage },
  { path: "/users", element: UsersPage },
  { path: "/users/create", element: UsersPage },
  { path: "/bus-trip", element: DashboardPage },
  { path: "/calendar", element: CalendarPage },
  { path: "/calendar/:month", element: CalendarMonthPage },
];

export const navRoutes = [
  { path: "/", label: "Home" },
  { path: "/users", label: "Usuários" },
  { path: "/bus-trip", label: "Viagens" },
  { path: "/calendar", label: "Calendário" },
];
