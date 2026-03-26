import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";

import Dashboard from "./app/Dashboard";
import Transactions from "./app/Transactions";
import Analytics from "./app/Analytics";
import Documents from "./app/Documents";
import Alerts from "./app/Alerts";
import Settings from "./app/Settings";

import Landing from "./public/Landing";
import Login from "./public/Login";
import Signup from "./public/Signup";
import Onboarding from "./public/Onboarding";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes (No Sidebar) */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/onboarding" element={<Onboarding />} />

      {/* Authenticated Routes (With Sidebar) */}
      <Route path="/dashboard" element={<MainLayout><Dashboard /></MainLayout>} />
      <Route path="/transactions" element={<MainLayout><Transactions /></MainLayout>} />
      <Route path="/analytics" element={<MainLayout><Analytics /></MainLayout>} />
      <Route path="/documents" element={<MainLayout><Documents /></MainLayout>} />
      <Route path="/alerts" element={<MainLayout><Alerts /></MainLayout>} />
      <Route path="/settings" element={<MainLayout><Settings /></MainLayout>} />
      
      {/* Fallback */}
      <Route path="*" element={<Navigate to="/enhanced" replace />} />
    </Routes>
  );
}

