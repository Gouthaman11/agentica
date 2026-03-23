import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";

import Dashboard from "./Dashboard";
import Transactions from "./Transactions";
import Analytics from "./Analytics";
import Documents from "./Documents";
import Alerts from "./Alerts";
import Settings from "./Settings";

export default function EnhancedApp() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/documents" element={<Documents />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/enhanced" replace />} />
      </Routes>
    </MainLayout>
  );
}
