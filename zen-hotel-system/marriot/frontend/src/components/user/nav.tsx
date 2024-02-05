"use client";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { NavButton } from "@/components/user/navButton";
import {
  LayoutDashboard,
  WalletCards,
  AreaChart,
  LogOut,
  BedDouble,
  Table2,
  Bolt,
} from "lucide-react";

const routes = [
  {
    value: "dashboard",
    label: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard className="w-4 h-4 mr-3" />,
  },
  {
    value: "reservations",
    label: "Reservations",
    href: "/reservations",
    icon: <BedDouble className="w-4 h-4 mr-3" />,
  },
  {
    value: "inventory",
    label: "Inventory",
    href: "/inventory",
    icon: <Table2 className="w-4 h-4 mr-3" />,
  },
  {
    value: "administration",
    label: "Administration",
    href: "/administration",
    icon: <Bolt className="w-4 h-4 mr-3" />,
  },
  {
    value: "purchase-logs",
    label: "Purchase Logs",
    href: "/purchase-logs",
    icon: <WalletCards className="w-4 h-4 mr-3" />,
  },
  {
    value: "analytics",
    label: "Analytics",
    href: "/analytics",
    icon: <AreaChart className="w-4 h-4 mr-3" />,
  },
];

export function Nav() {
  const currentPath = usePathname();
  return (
    <nav className="flex flex-col py-8 pr-8 border-r gap-y-3 sticky top-0">
      {routes.map((route) => (
        <NavButton
          variant={currentPath.includes(route.value) ? "default" : "secondary"}
          key={route.value}
          href={route.href}
          icon={route.icon}
        >
          {route.label}
        </NavButton>
      ))}
      <Button>Log Out</Button>
    </nav>
  );
}