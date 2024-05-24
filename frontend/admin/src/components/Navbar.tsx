import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Link, Outlet } from "react-router-dom";
import {
  LineChart,
  Package,
  Package2,
  Settings,
  ShoppingCart,
  Users2,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const navbarItems = [
  { icon: ShoppingCart, text: "Orders", isActive: false },
  { icon: Package, text: "Products", isActive: false },
  { icon: Users2, text: "Customers", isActive: false },
  { icon: LineChart, text: "Analytics", isActive: false },
  { icon: Settings, text: "Settings", isActive: false },
];

export default function Navbar() {
  const [activeIndex, setActiveIndex] = useState(null);

  const handleItemClick = (index: number | React.SetStateAction<null>) => {
    setActiveIndex(index);
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
          <a
            href="#"
            className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
          >
            <Package2 className="h-4 w-4 transition-all group-hover:scale-110" />
            <span className="sr-only">Acme Inc</span>
          </a>

          {navbarItems.map((item, index) => (
            <TooltipProvider key={index}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    onClick={() => handleItemClick(index)}
                    to={item.text.toLowerCase()}
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-lg text-accent-foreground transition-colors hover:text-foreground md:h-8 md:w-8",
                      {
                        "bg-accent": activeIndex === index,
                      }
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="sr-only">{item.text}</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">{item.text}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </nav>
      </aside>

      <Outlet />
    </div>
  );
}
