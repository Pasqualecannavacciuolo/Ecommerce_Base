import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ChevronLeft,
  File,
  ChevronRight,
  Copy,
  CreditCard,
  Home,
  LineChart,
  ListFilter,
  MoreVertical,
  Package,
  Package2,
  PanelLeft,
  Search,
  ShoppingCart,
  Truck,
  Users2,
  CheckCheck,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { jwtDecode } from "jwt-decode";
import Cookies from "universal-cookie";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { IJWTPayloadExtension, Order, Product, User } from "@/models/models";

const cookies = new Cookies(null, { path: "/" });

export default function OrdersPage() {
  const navigate = useNavigate();

  const [activeIndex, setActiveIndex] = useState<number | null>(null); // Indica quale riga della tabella e' attiva dopo averci cliccato
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [orders, setOrders] = useState<Order[] | []>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [filters, setFilters] = useState({
    ricevuto: true,
    completato: true,
    cancellato: true,
    sospeso: true,
    rimborsato: true,
    in_lavorazione: true,
  });

  const user_email = cookies.get("user_email");

  // Viene attivato quando clicco sul pulsante per copiare l'id dell'ordine
  const handleClickCopy = async (orderId: string) => {
    try {
      await navigator.clipboard.writeText(orderId);
      setIsCopied(true);
      // Opzionale: aggiungi un ritardo per mostrare il feedback al utente
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Errore nella copia dell'ID ordine:", error);
    }
  };

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

        setOrders(await getOrders());
      } catch (error) {
        console.log(error);
      }
    }

    checkPermission();
  }, [navigate, user_email]);

  // Viene attivata quando clicco su un elemento della tabella degli ordini recenti
  const handleClick = async (index: number, order: Order) => {
    setActiveIndex(index);
    setCurrentOrder(order);
    const user = await getUser(order);
    setUser(user);
  };

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

  // Funzione che ottiene tutti gli ordini dal Database
  async function getOrders() {
    try {
      const response = await fetch("http://localhost:3000/order/get", {
        method: "GET",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.log(error);
    }
  }

  // Funzione che ottiene i dati di un utente specifico tramite il suo id
  async function getUser(order: Order) {
    try {
      if (!order) {
        console.log("Ordine non definito");
        return null; // o un valore di default appropriato
      }

      const response = await fetch(`http://localhost:3000/user/detail`, {
        method: "POST",
        body: JSON.stringify({ id: order.user_id }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });
      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      console.log(error);
      return null; // o gestione degli errori appropriata
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
              <BreadcrumbLink asChild>
                <Link to="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Ordini</BreadcrumbPage>
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
      <main
        className={cn(
          "grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-2 xl:grid-cols-2",
          {
            "lg:grid-cols-3 xl:grid-cols-3": activeIndex !== null,
          }
        )}
      >
        <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
            <Card className="sm:col-span-2" x-chunk="dashboard-05-chunk-0">
              <CardHeader className="pb-3">
                <CardTitle>Your Orders</CardTitle>
                <CardDescription className="max-w-lg text-balance leading-relaxed">
                  Introducing Our Dynamic Orders Dashboard for Seamless
                  Management and Insightful Analysis.
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button>Create New Order</Button>
              </CardFooter>
            </Card>
            <Card x-chunk="dashboard-05-chunk-1">
              <CardHeader className="pb-2">
                <CardDescription>This Week</CardDescription>
                <CardTitle className="text-4xl">$1,329</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground">
                  +25% from last week
                </div>
              </CardContent>
              <CardFooter>
                <Progress value={25} aria-label="25% increase" />
              </CardFooter>
            </Card>
            <Card x-chunk="dashboard-05-chunk-2">
              <CardHeader className="pb-2">
                <CardDescription>This Month</CardDescription>
                <CardTitle className="text-4xl">$5,329</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground">
                  +10% from last month
                </div>
              </CardContent>
              <CardFooter>
                <Progress value={12} aria-label="12% increase" />
              </CardFooter>
            </Card>
          </div>
          <Tabs defaultValue="week">
            <div className="flex items-center">
              <TabsList>
                <TabsTrigger value="week">Week</TabsTrigger>
                <TabsTrigger value="month">Month</TabsTrigger>
                <TabsTrigger value="year">Year</TabsTrigger>
              </TabsList>
              <div className="ml-auto flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 gap-1 text-sm"
                    >
                      <ListFilter className="h-3.5 w-3.5" />
                      <span className="sr-only sm:not-sr-only">Filter</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem
                      checked={filters.ricevuto}
                      onClick={() =>
                        setFilters((prevFilters) => ({
                          ...prevFilters,
                          ricevuto: !prevFilters.ricevuto,
                        }))
                      }
                    >
                      ricevuto
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={filters.completato}
                      onClick={() =>
                        setFilters((prevFilters) => ({
                          ...prevFilters,
                          completato: !prevFilters.completato,
                        }))
                      }
                    >
                      completato
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={filters.cancellato}
                      onClick={() =>
                        setFilters((prevFilters) => ({
                          ...prevFilters,
                          cancellato: !prevFilters.cancellato,
                        }))
                      }
                    >
                      cancellato
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={filters.sospeso}
                      onClick={() =>
                        setFilters((prevFilters) => ({
                          ...prevFilters,
                          sospeso: !prevFilters.sospeso,
                        }))
                      }
                    >
                      sospeso
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={filters.rimborsato}
                      onClick={() =>
                        setFilters((prevFilters) => ({
                          ...prevFilters,
                          rimborsato: !prevFilters.rimborsato,
                        }))
                      }
                    >
                      rimborsato
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={filters.in_lavorazione}
                      onClick={() =>
                        setFilters((prevFilters) => ({
                          ...prevFilters,
                          in_lavortazione: !prevFilters.in_lavorazione,
                        }))
                      }
                    >
                      in lavorazione
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 gap-1 text-sm"
                >
                  <File className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only">Export</span>
                </Button>
              </div>
            </div>
            <TabsContent value="week">
              <Card x-chunk="dashboard-05-chunk-3">
                <CardHeader className="px-7">
                  <CardTitle>Ordini</CardTitle>
                  <CardDescription>I tuoi ordini recenti</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID Ordine</TableHead>
                        <TableHead className="hidden sm:table-cell">
                          Status
                        </TableHead>
                        <TableHead className="hidden md:table-cell">
                          Effettuato il
                        </TableHead>
                        <TableHead className="hidden md:table-cell">
                          Amount
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders
                        .filter((order) => {
                          if (filters.ricevuto && order.status === "ricevuto")
                            return true;
                          if (
                            filters.completato &&
                            order.status === "completato"
                          )
                            return true;
                          if (
                            filters.cancellato &&
                            order.status === "cancellato"
                          )
                            return true;
                          if (filters.sospeso && order.status === "sospeso")
                            return true;
                          if (
                            filters.rimborsato &&
                            order.status === "rimborsato"
                          )
                            return true;
                          if (
                            filters.in_lavorazione &&
                            order.status === "in lavorazione"
                          )
                            return true;

                          return false;
                        })
                        .map((order, index) => (
                          <TableRow
                            key={index}
                            onClick={() => handleClick(index, order)}
                            className={cn("cursor-pointer", {
                              "bg-accent": activeIndex === index,
                            })}
                          >
                            <TableCell>
                              <div className="font-medium">{order.id}</div>
                            </TableCell>
                            <TableCell className="hidden sm:table-cell">
                              <Badge
                                className={cn("text-xs", {
                                  "bg-slate-300": order.status === "ricevuto",
                                  "bg-amber-300":
                                    order.status === "in lavorazione",
                                  " bg-indigo-300": order.status === "sospeso",
                                  "bg-emerald-300":
                                    order.status === "completato",
                                  "bg-red-300": order.status === "cancellato",
                                  "bg-blue-300": order.status === "rimborsato",
                                })}
                                variant="secondary"
                              >
                                {order.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              {format(
                                new Date(order.createdAt),
                                "dd/MM/yyyy HH:mm:ss"
                              )}
                            </TableCell>
                            <TableCell className="">${order.total}</TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        <div className={activeIndex !== null ? "flex-grow" : ""}>
          {activeIndex !== null ? (
            <Card className="overflow-hidden" x-chunk="dashboard-05-chunk-4">
              <CardHeader className="flex flex-row items-start bg-muted/50">
                <div className="grid gap-0.5">
                  <CardTitle className="group flex items-center gap-2 text-lg">
                    {currentOrder?.id}
                    <Button
                      onClick={() =>
                        handleClickCopy(currentOrder!.id.toString())
                      }
                      size="icon"
                      variant="outline"
                      className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      {!isCopied ? (
                        <Copy className="h-3 w-3" />
                      ) : (
                        <CheckCheck className="h-3 w-3 text-emerald-600" />
                      )}
                      <span className="sr-only">Copy Order ID</span>
                    </Button>
                  </CardTitle>
                  <CardDescription>
                    {format(
                      new Date(currentOrder!.createdAt),
                      "dd/MM/yyyy HH:mm:ss"
                    )}
                  </CardDescription>
                </div>
                <div className="ml-auto flex items-center gap-1">
                  <Button size="sm" variant="outline" className="h-8 gap-1">
                    <Truck className="h-3.5 w-3.5" />
                    <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
                      Track Order
                    </span>
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon" variant="outline" className="h-8 w-8">
                        <MoreVertical className="h-3.5 w-3.5" />
                        <span className="sr-only">More</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Export</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Trash</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="p-6 text-sm">
                <div className="grid gap-3">
                  <div className="font-semibold">Dettagli ordine</div>
                  <ul className="grid gap-3">
                    {currentOrder?.products.map((product: Product) => (
                      <li
                        key={product.product_id}
                        className="flex items-center justify-between"
                      >
                        <span className="text-muted-foreground">
                          {product.product.product_name} x{" "}
                          <span>
                            {product.quantity} (${product.product.price})cad
                          </span>
                        </span>
                        <span>${product.quantity * product.product.price}</span>
                      </li>
                    ))}
                  </ul>
                  <Separator className="my-2" />
                  <ul className="grid gap-3">
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        Totale merce
                      </span>
                      <span>${currentOrder?.total}</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">Spedizione</span>
                      <span>$5.00</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">Tasse</span>
                      <span>$25.00</span>
                    </li>
                    <li className="flex items-center justify-between font-semibold">
                      <span className="text-muted-foreground">Totale</span>
                      <span>
                        ${parseFloat(currentOrder!.total.toString()) + 5 + 25}
                      </span>
                    </li>
                  </ul>
                </div>
                <Separator className="my-4" />
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-3">
                    <div className="font-semibold">
                      Informazioni di spedizione
                    </div>
                    <address className="grid gap-0.5 not-italic text-muted-foreground">
                      <span>Liam Johnson</span>
                      <span>1234 Main St.</span>
                      <span>Anytown, CA 12345</span>
                    </address>
                  </div>
                  <div className="grid auto-rows-max gap-3">
                    <div className="font-semibold">
                      Informazioni di fatturazione
                    </div>
                    <div className="text-muted-foreground">
                      Same as shipping address
                    </div>
                  </div>
                </div>
                <Separator className="my-4" />
                <div className="grid gap-3">
                  <div className="font-semibold">Informazioni del cliente</div>
                  <dl className="grid gap-3">
                    <div className="flex items-center justify-between">
                      <dt className="text-muted-foreground">Cliente</dt>
                      <dd>{user?.name}</dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-muted-foreground">Email</dt>
                      <dd>
                        <a href="mailto:">{user?.email}</a>
                      </dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-muted-foreground">Phone</dt>
                      <dd>
                        <a href="tel:">+1 234 567 890</a>
                      </dd>
                    </div>
                  </dl>
                </div>
                <Separator className="my-4" />
                <div className="grid gap-3">
                  <div className="font-semibold">Informazioni di pagamento</div>
                  <dl className="grid gap-3">
                    <div className="flex items-center justify-between">
                      <dt className="flex items-center gap-1 text-muted-foreground">
                        <CreditCard className="h-4 w-4" />
                        Visa
                      </dt>
                      <dd>**** **** **** 4532</dd>
                    </div>
                  </dl>
                </div>
              </CardContent>
              <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
                <div className="text-xs text-muted-foreground">
                  Updated <time dateTime="2023-11-23">November 23, 2023</time>
                </div>
                <Pagination className="ml-auto mr-0 w-auto">
                  <PaginationContent>
                    <PaginationItem>
                      <Button size="icon" variant="outline" className="h-6 w-6">
                        <ChevronLeft className="h-3.5 w-3.5" />
                        <span className="sr-only">Previous Order</span>
                      </Button>
                    </PaginationItem>
                    <PaginationItem>
                      <Button size="icon" variant="outline" className="h-6 w-6">
                        <ChevronRight className="h-3.5 w-3.5" />
                        <span className="sr-only">Next Order</span>
                      </Button>
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </CardFooter>
            </Card>
          ) : null}
        </div>
      </main>
    </div>
  );
}
