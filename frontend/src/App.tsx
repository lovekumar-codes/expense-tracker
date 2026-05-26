import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";

import Dashboard from "./pages/Dashboard";
import Expenses from "./pages/Expenses";
import Budget from "./pages/Budget";
import Reports from "./pages/Reports";

import MainLayout from "./layouts/mainLayout";
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC ROUTES */}

        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/register"
          element={<Register />}
        />

        {/* PROTECTED ROUTES */}

        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/expenses"
            element={<Expenses />}
          />

          <Route
            path="/budget"
            element={<Budget />}
          />

          <Route
            path="/reports"
            element={<Reports />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
