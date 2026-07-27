import Navbar from "@/components/layout/Navbar";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    // Añadimos bg-gray-50 (claro) y bg-slate-950 (oscuro)
    // Añadimos text-slate-900 (claro) y text-slate-100 (oscuro)
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>

      <footer className="p-6 text-center text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-slate-800">
        © 2026 TuraTrip
      </footer>
    </div>
  );
}