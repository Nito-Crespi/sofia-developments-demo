import { Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import Dashboard from "../layout/Dashboard";
import Login from "../modules/auth/pages/Login";
import { useAuthStore } from "../modules/auth/store/authStore";
import ProjectsKanbanPage from "../modules/kanban/ProjectsKanbanPage";
import EmployeeProfilePage from "../modules/employee/pages/EmployeeProfilePage";
import EmployeeCreatePage from "../modules/employee/pages/EmployeeCreatePage";
import EmployeeEditPage from "../modules/employee/pages/EmployeeEditPage";
import HoursComputationDemoPage from "../modules/finance/pages/HoursComputationDemoPage";
import FinancialDashboardPage from "../modules/finance/pages/FinancialDashboardPage";

function NotFoundPage() {
  return (
    <div style={{ padding: 24 }}>
      <h2>404</h2>
      <p>Página no encontrada.</p>
    </div>
  );
}

function FinanceSummaryPage() {
  return <FinancialDashboardPage />;
}
function FinanceReportsPage() {
  return <div style={{ padding: 24 }}>Finanzas · Reportes (TODO)</div>;
}
function ProjectsReportsPage() {
  return <div style={{ padding: 24 }}>Proyectos · Reportes (TODO)</div>;
}
function ProjectsFilesPage() {
  return <div style={{ padding: 24 }}>Proyectos · Archivos (TODO)</div>;
}

export default function AppRoutes() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const session = useAuthStore((s) => s.session);
  const authed = session && isAuthenticated();

  return (
    <Routes>
      {/* root */}
      <Route
        path="/"
        element={<Navigate to={authed ? "/dashboard" : "/login"} replace />}
      />

      {/* public */}
      <Route
        path="/login"
        element={authed ? <Navigate to="/dashboard" replace /> : <Login />}
      />

      {/* private */}
      <Route element={<PrivateRoute />}>
        <Route element={<Dashboard />}>
          <Route path="/dashboard" element={<div>Dashboard (Home)</div>} />

          {/* <Route path="/projects/constructions" element={<ProjectsPage />} /> */}
          <Route
            path="/projects/constructions"
            element={<ProjectsKanbanPage />}
          />
          <Route path="/projects/reports" element={<ProjectsReportsPage />} />
          <Route path="/projects/files" element={<ProjectsFilesPage />} />

          <Route path="/finance/summary" element={<FinanceSummaryPage />} />
          <Route path="/finance/reports" element={<FinanceReportsPage />} />
          <Route
            path="/finance/hours-demo"
            element={<HoursComputationDemoPage />}
          />


          <Route path="/employees/profiles" element={<EmployeeProfilePage />} />
          <Route path="/employees/create" element={<EmployeeCreatePage />} />
          <Route path="/employees/edit" element={<EmployeeEditPage />} />

          {/* default privado */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Route>

      {/* catch-all público */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
