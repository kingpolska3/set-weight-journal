import { Link } from "@tanstack/react-router";
import {
  BarChart3,
  CalendarDays,
  ClipboardList,
  Dumbbell,
  LayoutGrid,
  User,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useTrainerAccess } from "@/hooks/useTrainerAccess";

type NavItem = {
  to: string;
  label: string;
  icon: typeof Dumbbell;
  exact?: boolean;
};

const clientItems: NavItem[] = [
  { to: "/historia", label: "Historia", icon: BarChart3 },
  { to: "/narzedzia", label: "Narzędzia", icon: LayoutGrid },
  { to: "/", label: "Trening", icon: Dumbbell, exact: true },
  { to: "/rezerwacje", label: "Rezerwacje", icon: CalendarDays },
  { to: "/profil", label: "Profil", icon: User },
];

const trainerItems: NavItem[] = [
  { to: "/historia", label: "Historia", icon: BarChart3 },
  { to: "/trener", label: "Trener", icon: ClipboardList },
  { to: "/", label: "Trening", icon: Dumbbell, exact: true },
  { to: "/rezerwacje", label: "Rezerwacje", icon: CalendarDays },
  { to: "/profil", label: "Profil", icon: User },
];

export function AppNav() {
  const { user } = useAuth();
  const { isTrainer } = useTrainerAccess(user?.id);
  const items = isTrainer ? trainerItems : clientItems;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-card/95 backdrop-blur">
        <ul className="mx-auto flex max-w-2xl">
          {items.map(({ to, label, icon: Icon, exact }) => (
            <li key={to} className="flex-1">
              <Link
                to={to}
                activeOptions={{ exact: exact ?? false }}
                activeProps={{ className: "text-primary" }}
                inactiveProps={{ className: "text-muted-foreground hover:text-foreground" }}
                className="flex flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium transition-colors hover:no-underline"
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
