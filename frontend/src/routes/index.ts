import {
  BusTripPage,
  CalendarPage,
  CreateUserPage,
  DashboardPage,
  LoginPage,
  UsersPage,
} from "../pages";

export const routes = [
  { path: "/", element: DashboardPage },
  { path: "/login", element: LoginPage },
  { path: "/usuarios", element: UsersPage },
  { path: "/usuarios/criar", element: CreateUserPage },
  { path: "/viagens", element: BusTripPage },
  { path: "/viagens/:id", element: BusTripPage },
  { path: "/calendario", element: CalendarPage },
];

export const navRoutes = [
  { path: "/", label: "Home" },
  { path: "/usuarios", label: "Usuários" },
  { path: "/viagens", label: "Viagens" },
  { path: "/calendario", label: "Calendário" },
];
