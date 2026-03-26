import { Link, useLocation } from "react-router-dom";
import {
  BarChart3,
  TrendingUp,
  Upload,
  Download,
  Settings,
  LayoutDashboard,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const location = useLocation();

  const menuItems = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/",
    },
    {
      label: "Transactions",
      icon: Upload,
      href: "/transactions",
    },
    {
      label: "Analytics",
      icon: BarChart3,
      href: "/analytics",
    },
    {
      label: "Export",
      icon: Download,
      href: "/export",
    },
    {
      label: "Settings",
      icon: Settings,
      href: "/settings",
    },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 min-h-screen flex flex-col fixed left-0 top-0">
      {/* Logo Section */}
      <div className="p-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              LedgerLens
            </h1>
            <p className="text-xs font-medium text-blue-600 dark:text-blue-400">AI</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-6 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            location.pathname === item.href ||
            (item.href !== "/" && location.pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium text-sm",
                isActive
                  ? "bg-blue-100 dark:bg-blue-900/40 text-blue-900 dark:text-blue-300"
                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50"
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-6 border-t border-slate-200 dark:border-slate-800">
        <div className="text-center">
          <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
            LedgerLens AI
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
            v1.0 • Premium Edition
          </p>
        </div>
      </div>
    </aside>
  );
}
