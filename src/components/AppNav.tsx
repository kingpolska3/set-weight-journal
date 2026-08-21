import { Link } from "@tanstack/react-router";
import { BarChart3, Dumbbell, LayoutGrid, Swords, User } from "lucide-react";

const items = [
  { to: "/", label: "Trening", icon: Dumbbell },
  { to: "/historia", label: "Historia", icon: BarChart3 },
  { to: "/narzedzia", label: "Narzędzia", icon: LayoutGrid },
  { to: "/vs", label: "VS", icon: Swords },
  { to: "/profil", label: "Profil", icon: User },
] as const;

export function AppNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-card/95 backdrop-blur">
      <ul className="mx-auto flex max-w-2xl">
        {items.map(({ to, label, icon: Icon }) => (
          <li key={to} className="flex-1">
            <Link
              to={to}
              activeOptions={{ exact: to === "/" }}
              activeProps={{ className: "text-primary" }}
              inactiveProps={{ className: "text-muted-foreground" }}
              className="flex flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium"
            >
              <Icon className="h-5 w-5" />
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
