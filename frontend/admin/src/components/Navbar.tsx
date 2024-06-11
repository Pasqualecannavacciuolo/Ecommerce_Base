import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Link, Outlet, useNavigate } from "react-router-dom";
import {
  LineChart,
  Package,
  Package2,
  Settings,
  ShoppingCart,
  SwatchBook,
  Users2,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import Cookies from "universal-cookie";
import { IJWTPayloadExtension } from "@/models/models";
import { jwtDecode } from "jwt-decode";

const cookies = new Cookies(null, { path: "/" });

const navbarItems = [
  { icon: ShoppingCart, text: "Ordini", isActive: false },
  { icon: Package, text: "Prodotti", isActive: false },
  { icon: SwatchBook, text: "Categorie", isActive: false },
  { icon: Users2, text: "Utenti", isActive: false },
  { icon: LineChart, text: "Statistiche", isActive: false },
  { icon: Settings, text: "Impostazioni", isActive: false },
];

export default function Navbar() {
  const navigate = useNavigate();
  const user_email = cookies.get("user_email");
  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    // Verifico se l'utente puo ancora accedere alla risorsa
    async function checkPermission() {
      try {
        const response = await fetch("http://localhost:3000/verifyJWT", {
          method: "POST",
          body: JSON.stringify({ email: user_email }),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        });
        const data = await response.json();
        console.log(data);

        // Se non sei autorizzato
        const status = response.status;
        if (status == 401) {
          navigate("/sign-in");
        }

        // Salvo l'access_token
        cookies.set("access_token", data.accessToken);

        const secretKey = await import.meta.env.VITE_JSONWEBTOKEN_SECRET_KEY;
        const token: string = data.accessToken;
        if (secretKey && token) {
          const decoded: IJWTPayloadExtension = jwtDecode(token);
          // Salvo nei cookies l'email dell'utente loggato
          if (decoded && decoded.userToSignJWT && decoded.userToSignJWT.email) {
            const email: string = decoded.userToSignJWT.email;
            cookies.set("user_email", email);
          }
        }
      } catch (error) {
        console.log(error);
      }
    }

    checkPermission();
  }, [navigate, user_email]);

  const handleItemClick = (index: number | React.SetStateAction<null>) => {
    setActiveIndex(index);
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
          <Link
            onClick={() => setActiveIndex(null)}
            to="/"
            className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
          >
            <Package2 className="h-4 w-4 transition-all group-hover:scale-110" />
            <span className="sr-only">Acme Inc</span>
          </Link>

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
