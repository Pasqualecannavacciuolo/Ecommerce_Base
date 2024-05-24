import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import {
  Home,
  LineChart,
  Package,
  Package2,
  PanelLeft,
  Search,
  ShoppingCart,
  Users2,
  DollarSign,
  Users,
  Box,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { jwtDecode } from "jwt-decode";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { IJWTPayloadExtension } from "@/models/models";
import BarChartComponent from "./reusable/BarChart";

const cookies = new Cookies(null, { path: "/" });

export default function HomePage() {
  const navigate = useNavigate();

  const user_email = cookies.get("user_email");

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

  // Viene attivato quando clicco sulla voce per effettuare il logout
  async function logout() {
    try {
      const user_email = cookies.get("user_email");
      const response = await fetch("http://localhost:3000/logout", {
        method: "POST",
        body: JSON.stringify({ email: user_email }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });
      const data = await response.json();
      console.log(data);

      // Se non e' andato a buon fine
      const status = response.status;
      if (status == 404) {
        // TODO
      }

      navigate("/sign-in");
      cookies.remove("user_email");
      cookies.remove("access_token");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
      <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
        <Sheet>
          <SheetTrigger asChild>
            <Button size="icon" variant="outline" className="sm:hidden">
              <PanelLeft className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="sm:max-w-xs">
            <nav className="grid gap-6 text-lg font-medium">
              <a
                href="#"
                className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
              >
                <Package2 className="h-5 w-5 transition-all group-hover:scale-110" />
                <span className="sr-only">Acme Inc</span>
              </a>
              <a
                href="#"
                className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
              >
                <Home className="h-5 w-5" />
                Dashboard
              </a>
              <a
                href="#"
                className="flex items-center gap-4 px-2.5 text-foreground"
              >
                <ShoppingCart className="h-5 w-5" />
                Orders
              </a>
              <a
                href="#"
                className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
              >
                <Package className="h-5 w-5" />
                Products
              </a>
              <a
                href="#"
                className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
              >
                <Users2 className="h-5 w-5" />
                Customers
              </a>
              <a
                href="#"
                className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
              >
                <LineChart className="h-5 w-5" />
                Settings
              </a>
            </nav>
          </SheetContent>
        </Sheet>
        <Breadcrumb className="hidden md:flex">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Home</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="relative ml-auto flex-1 md:grow-0">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="overflow-hidden rounded-full"
            >
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>
      <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-2 xl:grid-cols-2">
        <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
            <Card x-chunk="dashboard-05-chunk-3">
              <CardHeader className="pb-2">
                <CardDescription className="flex flex-row justify-between items-center text-primary font-medium">
                  <span>Fatturato totale</span>
                  <DollarSign className="w-5 h-5" />
                </CardDescription>
                <CardTitle className="text-4xl">$45,231.89</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-emerald-500">
                  +25% dallo scorso anno
                </div>
              </CardContent>
            </Card>
            <Card x-chunk="dashboard-05-chunk-3">
              <CardHeader className="pb-2">
                <CardDescription className="flex flex-row justify-between items-center text-primary font-medium">
                  Utenti registrati
                  <Users className="w-5 h-5" />
                </CardDescription>
                <CardTitle className="text-4xl">+2350</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-emerald-500">
                  +5% dallo scorso anno
                </div>
              </CardContent>
            </Card>
            <Card x-chunk="dashboard-05-chunk-3">
              <CardHeader className="pb-2">
                <CardDescription className="flex flex-row justify-between items-center text-primary font-medium">
                  Ordini questo mese
                  <Box className="w-5 h-5" />
                </CardDescription>
                <CardTitle className="text-4xl">+12,234</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-emerald-500">
                  +135% dallo scorso mese
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
            <Card x-chunk="dashboard-01-chunk-5">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle>Ordini</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+2350</div>
                <p className="text-xs text-emerald-500">
                  +180.1% from last month
                </p>
                <div className="mt-4">
                  <BarChartComponent />
                </div>
              </CardContent>
            </Card>
            <Card x-chunk="dashboard-01-chunk-5">
              <CardHeader>
                <CardTitle>Recent Sales</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-8">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-row gap-4">
                    <Avatar className="hidden h-9 w-9 sm:flex">
                      <AvatarImage src="/avatars/01.png" alt="Avatar" />
                      <AvatarFallback>OM</AvatarFallback>
                    </Avatar>
                    <div className="grid gap-1">
                      <p className="sm:text-md text-xs lg:text-lg xl:text-lg font-medium leading-none">
                        Olivia Martin
                      </p>
                      <p className="sm:text-md text-xs lg:text-md xl:text-md text-muted-foreground">
                        olivia.martin@email.com
                      </p>
                    </div>
                    <div className="ml-auto sm:text-md text-xs lg:text-lg xl:text-lg font-medium text-emerald-500">
                      +$1,999.00
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-row gap-4">
                    <Avatar className="hidden h-9 w-9 sm:flex">
                      <AvatarImage src="/avatars/02.png" alt="Avatar" />
                      <AvatarFallback>JL</AvatarFallback>
                    </Avatar>
                    <div className="grid gap-1">
                      <p className="sm:text-md text-xs lg:text-lg xl:text-lg font-medium leading-none">
                        Jackson Lee
                      </p>
                      <p className="sm:text-md text-xs lg:text-md xl:text-md text-muted-foreground">
                        jackson.lee@email.com
                      </p>
                    </div>
                    <div className="ml-auto sm:text-md text-xs lg:text-lg xl:text-lg font-medium text-emerald-500">
                      +$39.00
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-row gap-4">
                    <Avatar className="hidden h-9 w-9 sm:flex">
                      <AvatarImage src="/avatars/03.png" alt="Avatar" />
                      <AvatarFallback>IN</AvatarFallback>
                    </Avatar>
                    <div className="grid gap-1">
                      <p className="sm:text-md text-xs lg:text-lg xl:text-lg font-medium leading-none">
                        Isabella Nguyen
                      </p>
                      <p className="sm:text-md text-xs lg:text-md xl:text-md text-muted-foreground">
                        isabella.nguyen@email.com
                      </p>
                    </div>
                    <div className="ml-auto sm:text-md text-xs lg:text-lg xl:text-lg font-medium text-emerald-500">
                      +$299.00
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-row gap-4">
                    <Avatar className="hidden h-9 w-9 sm:flex">
                      <AvatarImage src="/avatars/02.png" alt="Avatar" />
                      <AvatarFallback>MH</AvatarFallback>
                    </Avatar>
                    <div className="grid gap-1">
                      <p className="sm:text-md text-xs lg:text-lg xl:text-lg font-medium leading-none">
                        Mark Hamil
                      </p>
                      <p className="sm:text-md text-xs lg:text-md xl:text-md text-muted-foreground">
                        mark.hamil@email.com
                      </p>
                    </div>
                    <div className="ml-auto sm:text-md text-xs lg:text-lg xl:text-lg font-medium text-emerald-500">
                      +$189.89
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-row gap-4">
                    <Avatar className="hidden h-9 w-9 sm:flex">
                      <AvatarImage src="/avatars/02.png" alt="Avatar" />
                      <AvatarFallback>JL</AvatarFallback>
                    </Avatar>
                    <div className="grid gap-1">
                      <p className="sm:text-md text-xs lg:text-lg xl:text-lg font-medium leading-none">
                        Jackson Lee
                      </p>
                      <p className="sm:text-md text-xs lg:text-md xl:text-md text-muted-foreground">
                        jackson.lee@email.com
                      </p>
                    </div>
                    <div className="ml-auto sm:text-md text-xs lg:text-lg xl:text-lg font-medium text-emerald-500">
                      +$39.00
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
