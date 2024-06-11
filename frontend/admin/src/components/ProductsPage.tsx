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
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { File, Search, Box, PlusCircle, MoreHorizontal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Cookies from "universal-cookie";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { SimpleProduct } from "@/models/models";
import { useNavigate } from "react-router-dom";

const cookies = new Cookies(null, { path: "/" });

const access_token = cookies.get("access_token");

export default function ProductsPage() {
  const navigate = useNavigate();

  const [activeIndex, setActiveIndex] = useState<number | null>(null); // Indica quale riga della tabella e' attiva dopo averci cliccato
  const [productsAttivi, setProductsAttivi] = useState<SimpleProduct[] | []>(
    []
  );
  const [productsBozze, setProductsBozze] = useState<SimpleProduct[] | []>([]);
  const [productsArchiviati, setProductsArchiviati] = useState<
    SimpleProduct[] | []
  >([]);
  const [productsTutti, setProductsTutti] = useState<SimpleProduct[] | []>([]);

  useEffect(() => {
    async function getProductsAttiviFromDB() {
      setProductsAttivi(await getProductsAttivi());
    }
    getProductsAttiviFromDB();
  }, []);

  // Viene attivata quando clicco su un elemento della tabella degli ordini recenti
  const handleClick = async (index: number, id: number) => {
    setActiveIndex(index);
    navigate(`/prodotti/${id}`);
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

  // Funzione che ottiene tutti gli i prodotti attivi dal Database
  async function getProductsAttivi() {
    try {
      const response = await fetch("http://localhost:3000/product/get/attivi", {
        method: "GET",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          Authorization: access_token,
        },
      });

      if (!response.ok) {
        throw new Error("Errore durante il fetch dei prodotti");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.log(error);
      // Gestisci il caso in cui l'access_token sia scaduto
      if (error.message.includes("401")) {
        // Prova a fare il refresh del token o chiedi all'utente di autenticarsi di nuovo
      }
    }
  }

  // Funzione che ottiene tutti gli i prodotti in stato di bozza dal Database
  async function getProductsBozze() {
    try {
      const response = await fetch("http://localhost:3000/product/get/bozze", {
        method: "GET",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          Authorization: access_token,
        },
      });

      if (!response.ok) {
        throw new Error("Errore durante il fetch dei prodotti");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.log(error);
      // Gestisci il caso in cui l'access_token sia scaduto
      if (error.message.includes("401")) {
        // Prova a fare il refresh del token o chiedi all'utente di autenticarsi di nuovo
      }
    }
  }

  // Funzione che ottiene tutti gli i prodotti archiviati dal Database
  async function getProductsArchiviati() {
    try {
      const response = await fetch(
        "http://localhost:3000/product/get/archiviati",
        {
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
            Authorization: access_token,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Errore durante il fetch dei prodotti");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.log(error);
      // Gestisci il caso in cui l'access_token sia scaduto
      if (error.message.includes("401")) {
        // Prova a fare il refresh del token o chiedi all'utente di autenticarsi di nuovo
      }
    }
  }

  // Funzione che ottiene tutti i prodotti dal Database
  async function getProductsTutti() {
    try {
      const response = await fetch("http://localhost:3000/product/get", {
        method: "GET",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          Authorization: access_token,
        },
      });

      if (!response.ok) {
        throw new Error("Errore durante il fetch dei prodotti");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.log(error);
      // Gestisci il caso in cui l'access_token sia scaduto
      if (error.message.includes("401")) {
        // Prova a fare il refresh del token o chiedi all'utente di autenticarsi di nuovo
      }
    }
  }

  async function setterProductsTutti() {
    setProductsTutti(await getProductsTutti());
  }
  async function setterProductsBozze() {
    setProductsBozze(await getProductsBozze());
  }
  async function setterProductsArchiviati() {
    setProductsArchiviati(await getProductsArchiviati());
  }

  return (
    <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
      <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
        <Breadcrumb className="hidden md:flex">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Prodotti</BreadcrumbPage>
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
            <DropdownMenuLabel>Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Impostazioni</DropdownMenuItem>
            <DropdownMenuItem>Supporto</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>Esci</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>
      <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
        <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-4">
            <Card className="" x-chunk="dashboard-05-chunk-0">
              <CardHeader className="pb-3">
                <CardTitle>I tuoi Prodotti</CardTitle>
                <CardDescription className="max-w-lg text-balance leading-relaxed">
                  In questa pagina potrai controllare tutti i Prodotti che
                  compongono il tuo catalogo. Qui potrai crearli, modificarli,
                  eliminarli e gestirli.
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button>Aggiungi un prodotto</Button>
              </CardFooter>
            </Card>
            <Card x-chunk="dashboard-05-chunk-3">
              <CardHeader className="pb-2">
                <CardDescription className="flex flex-row justify-between items-center text-primary font-medium">
                  <span>Prodotti totali</span>
                  <Box className="w-5 h-5" />
                </CardDescription>
                <CardTitle className="text-4xl">125</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-emerald-500">
                  +38% dallo scorso anno
                </div>
              </CardContent>
            </Card>
            <Card x-chunk="dashboard-05-chunk-3">
              <CardHeader className="pb-2">
                <CardDescription className="flex flex-row justify-between items-center text-primary font-medium">
                  <span>Prodottyi attivi</span>
                  <Box className="w-5 h-5" />
                </CardDescription>
                <CardTitle className="text-4xl">87</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-emerald-500">
                  +3% dallo scorso mese
                </div>
              </CardContent>
            </Card>
          </div>
          <Tabs defaultValue="Attivi">
            <div className="flex items-center">
              <TabsList>
                <TabsTrigger value="Attivi">Attivi</TabsTrigger>
                <TabsTrigger
                  value="Archiviati"
                  onClick={() => {
                    if (productsTutti.length == 0) {
                      setterProductsArchiviati();
                    } else {
                      return;
                    }
                  }}
                >
                  Archiviati
                </TabsTrigger>
                <TabsTrigger
                  value="Bozze"
                  onClick={() => {
                    if (productsTutti.length == 0) {
                      setterProductsBozze();
                    } else {
                      return;
                    }
                  }}
                >
                  Bozze
                </TabsTrigger>
                <TabsTrigger
                  value="Tutti"
                  onClick={() => {
                    if (productsTutti.length == 0) {
                      setterProductsTutti();
                    } else {
                      return;
                    }
                  }}
                >
                  Tutti
                </TabsTrigger>
              </TabsList>
              <div className="ml-auto flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 gap-1 text-sm"
                >
                  <File className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only">Esporta in CSV</span>
                </Button>
                <Button size="sm" className="h-7 gap-1">
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Aggiungi prodotto
                  </span>
                </Button>
              </div>
            </div>
            {/* TAB PRODOTTI ATTIVI */}
            <TabsContent value="Attivi">
              <Card x-chunk="dashboard-05-chunk-3">
                <CardHeader className="px-7">
                  <CardTitle>Prodotti</CardTitle>
                  <CardDescription>Tutti i prodotti attivi</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Immagine</TableHead>
                        <TableHead>ID Prodotto</TableHead>
                        <TableHead className="hidden sm:table-cell">
                          Nome
                        </TableHead>
                        <TableHead className="hidden md:table-cell">
                          Descrizione
                        </TableHead>
                        <TableHead className="hidden md:table-cell">
                          Prezzo
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {productsAttivi.map((product, index) => (
                        <TableRow
                          key={index}
                          onClick={() => handleClick(index, product.id)}
                          className={cn("cursor-pointer", {
                            "bg-accent": activeIndex === index,
                          })}
                        >
                          <TableCell className="hidden sm:table-cell">
                            <img
                              src={`/${product.id}.jpg`}
                              width="64"
                              height="64"
                              className="aspect-square rounded-md object-contain"
                              alt={product.product_name}
                            />
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{product.id}</div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">
                              {product.product_name}
                            </div>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            <Badge
                              className={cn("text-xs", {
                                "bg-slate-300":
                                  product.status !== "Bozza" &&
                                  product.status !== "Attivo" &&
                                  product.status !== "Archiviato",
                                "bg-amber-300": product.status === "Bozza",
                                "bg-emerald-300": product.status === "Attivo",
                                "bg-blue-300": product.status === "Archiviato",
                              })}
                              variant="secondary"
                            >
                              {product.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="">${product.price}</TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  aria-haspopup="true"
                                  size="icon"
                                  variant="ghost"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Apri menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Azioni</DropdownMenuLabel>
                                <DropdownMenuItem>Modifica</DropdownMenuItem>
                                <DropdownMenuItem>Cancella</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            {/* TAB PRODOTTI BOZZE */}
            <TabsContent value="Bozze">
              <Card x-chunk="dashboard-05-chunk-3">
                <CardHeader className="px-7">
                  <CardTitle>Prodotti</CardTitle>
                  <CardDescription>
                    Tutti i prodotti in stato di bozza
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Immagine</TableHead>
                        <TableHead>ID Prodotto</TableHead>
                        <TableHead className="hidden sm:table-cell">
                          Nome
                        </TableHead>
                        <TableHead className="hidden md:table-cell">
                          Descrizione
                        </TableHead>
                        <TableHead className="hidden md:table-cell">
                          Prezzo
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {productsBozze.map((product, index) => (
                        <TableRow
                          key={index}
                          onClick={() => handleClick(index, product)}
                          className={cn("cursor-pointer", {
                            "bg-accent": activeIndex === index,
                          })}
                        >
                          <TableCell className="hidden sm:table-cell">
                            <img
                              src={`/${product.id}.jpg`}
                              width="64"
                              height="64"
                              className="aspect-square rounded-md object-contain"
                              alt={product.product_name}
                            />
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{product.id}</div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">
                              {product.product_name}
                            </div>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            <Badge
                              className={cn("text-xs", {
                                "bg-slate-300":
                                  product.status !== "Bozza" &&
                                  product.status !== "Attivo" &&
                                  product.status !== "Archiviato",
                                "bg-amber-300": product.status === "Bozza",
                                "bg-emerald-300": product.status === "Attivo",
                                "bg-blue-300": product.status === "Archiviato",
                              })}
                              variant="secondary"
                            >
                              {product.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="">${product.price}</TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  aria-haspopup="true"
                                  size="icon"
                                  variant="ghost"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Apri menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Azioni</DropdownMenuLabel>
                                <DropdownMenuItem>Modifica</DropdownMenuItem>
                                <DropdownMenuItem>Cancella</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            {/* TAB PRODOTTI ARCHIVIATI */}
            <TabsContent value="Archiviati">
              <Card x-chunk="dashboard-05-chunk-3">
                <CardHeader className="px-7">
                  <CardTitle>Prodotti</CardTitle>
                  <CardDescription>Tutti i prodotti archiviati</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Immagine</TableHead>
                        <TableHead>ID Prodotto</TableHead>
                        <TableHead className="hidden sm:table-cell">
                          Nome
                        </TableHead>
                        <TableHead className="hidden md:table-cell">
                          Descrizione
                        </TableHead>
                        <TableHead className="hidden md:table-cell">
                          Prezzo
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {productsArchiviati.map((product, index) => (
                        <TableRow
                          key={index}
                          onClick={() => handleClick(index, product)}
                          className={cn("cursor-pointer", {
                            "bg-accent": activeIndex === index,
                          })}
                        >
                          <TableCell className="hidden sm:table-cell">
                            <img
                              src={`/${product.id}.jpg`}
                              width="64"
                              height="64"
                              className="aspect-square rounded-md object-contain"
                              alt={product.product_name}
                            />
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{product.id}</div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">
                              {product.product_name}
                            </div>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            <Badge
                              className={cn("text-xs", {
                                "bg-slate-300":
                                  product.status !== "Bozza" &&
                                  product.status !== "Attivo" &&
                                  product.status !== "Archiviato",
                                "bg-amber-300": product.status === "Bozza",
                                "bg-emerald-300": product.status === "Attivo",
                                "bg-blue-300": product.status === "Archiviato",
                              })}
                              variant="secondary"
                            >
                              {product.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="">${product.price}</TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  aria-haspopup="true"
                                  size="icon"
                                  variant="ghost"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Apri menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Azioni</DropdownMenuLabel>
                                <DropdownMenuItem>Modifica</DropdownMenuItem>
                                <DropdownMenuItem>Cancella</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            {/* TAB TUTTI I PRODOTTI */}
            <TabsContent value="Tutti">
              <Card x-chunk="dashboard-05-chunk-3">
                <CardHeader className="px-7">
                  <CardTitle>Prodotti</CardTitle>
                  <CardDescription>Tutti i tuoi prodotti</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Immagine</TableHead>
                        <TableHead>ID Prodotto</TableHead>
                        <TableHead className="hidden sm:table-cell">
                          Nome
                        </TableHead>
                        <TableHead className="hidden md:table-cell">
                          Descrizione
                        </TableHead>
                        <TableHead className="hidden md:table-cell">
                          Prezzo
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {productsTutti.map((product, index) => (
                        <TableRow
                          key={index}
                          onClick={() => handleClick(index, product)}
                          className={cn("cursor-pointer", {
                            "bg-accent": activeIndex === index,
                          })}
                        >
                          <TableCell className="hidden sm:table-cell">
                            <img
                              src={`/${product.id}.jpg`}
                              width="64"
                              height="64"
                              className="aspect-square rounded-md object-contain"
                              alt={product.product_name}
                            />
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{product.id}</div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">
                              {product.product_name}
                            </div>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            <Badge
                              className={cn("text-xs", {
                                "bg-slate-300":
                                  product.status !== "Bozza" &&
                                  product.status !== "Attivo" &&
                                  product.status !== "Archiviato",
                                "bg-amber-300": product.status === "Bozza",
                                "bg-emerald-300": product.status === "Attivo",
                                "bg-blue-300": product.status === "Archiviato",
                              })}
                              variant="secondary"
                            >
                              {product.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="">${product.price}</TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  aria-haspopup="true"
                                  size="icon"
                                  variant="ghost"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Apri menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Azioni</DropdownMenuLabel>
                                <DropdownMenuItem>Modifica</DropdownMenuItem>
                                <DropdownMenuItem>Cancella</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
