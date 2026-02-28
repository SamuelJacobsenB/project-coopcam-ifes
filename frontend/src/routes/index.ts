import {
  BusTripPage,
  CalendarPage,
  CreatePaymentFeeConfigPage,
  CreateUserPage,
  DashboardPage,
  DevelopmentPage,
  LoginPage,
  PaymentsPage,
  UsersPage,
} from "../pages";

export const routes = [
  { path: "/", element: DashboardPage },
  { path: "/login", element: LoginPage },
  { path: "/usuarios", element: UsersPage },
  { path: "/usuarios/:id", element: UsersPage },
  { path: "/usuarios/criar", element: CreateUserPage },
  { path: "/viagens", element: BusTripPage },
  { path: "/viagens/:id", element: BusTripPage },
  { path: "/pagamentos", element: PaymentsPage },
  { path: "/pagamentos/criar", element: CreatePaymentFeeConfigPage },
  { path: "/calendario", element: CalendarPage },
  { path: "/development", element: DevelopmentPage },
  { path: "/development/:id", element: DevelopmentPage },
];

export const navRoutes = [
  { path: "/", label: "Home" },
  { path: "/usuarios", label: "Usuários" },
  { path: "/viagens", label: "Viagens" },
  { path: "/pagamentos", label: "Pagamentos" },
  { path: "/calendario", label: "Calendário" },
];
