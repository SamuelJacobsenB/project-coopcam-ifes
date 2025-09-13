import {
  BusTripPage,
  BusTripStatsPage,
  CalendarMonthPage,
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
  { path: "/usarios/criar", element: CreateUserPage },
  { path: "/viagens", element: BusTripPage },
  { path: "/viagens/:id", element: BusTripStatsPage },
  { path: "/calendario", element: CalendarPage },
  { path: "/calendario/:month", element: CalendarMonthPage },
];

export const navRoutes = [
  { path: "/", label: "Home" },
  { path: "/usuarios", label: "Usuários" },
  { path: "/viagens", label: "Viagens" },
  { path: "/calendario", label: "Calendário" },
];
