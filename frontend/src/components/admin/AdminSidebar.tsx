"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function AdminSidebar() {
  const pathname = usePathname();

  const links = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Usuarios", href: "/dashboard/usuarios" },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-100 min-h-screen p-6 flex flex-col justify-between">
      <div>
        <div className="mb-8">
          <h1 className="text-2xl font-black tracking-tight text-white">
            Tura<span className="text-[hsl(38_95%_55%)]">Trip</span>
          </h1>
          <span className="text-xs text-emerald-400 font-semibold tracking-wide uppercase">
            Panel Admin
          </span>
        </div>

        <nav className="space-y-2">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
                  isActive
                    ? "bg-[hsl(174_72%_25%)] text-white shadow-md"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <Link
        href="/"
        className="text-xs text-slate-400 hover:text-white transition-colors"
      >
        ← Volver a la app principal
      </Link>
    </aside>
  );
}
