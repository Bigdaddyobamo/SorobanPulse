import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import { Layout } from "./components/Layout";
import { AccountPage } from "./pages/AccountPage";
import { AdminPage } from "./pages/AdminPage";
import { ContractPage } from "./pages/ContractPage";
import { Explorer } from "./pages/Explorer";
import { NotFound } from "./pages/NotFound";
import { StatusPage } from "./pages/StatusPage";
import { TxPage } from "./pages/TxPage";

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { index: true, element: <Navigate to="/explorer" replace /> },
      { path: "explorer", element: <Explorer /> },
      { path: "contracts/:contractId", element: <ContractPage /> },
      { path: "accounts/:accountId", element: <AccountPage /> },
      { path: "tx/:txHash", element: <TxPage /> },
      { path: "status", element: <StatusPage /> },
      { path: "admin", element: <AdminPage /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

export function App() {
  return <RouterProvider router={router} />;
}
