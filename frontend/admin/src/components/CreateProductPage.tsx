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
import { Search, PlusCircle, Upload, Check, CircleMinus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Cookies from "universal-cookie";
import { Link } from "react-router-dom";
import { useState } from "react";
import { SimpleProduct } from "@/models/models";
import { Label } from "./ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./ui/select";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import { Textarea } from "./ui/textarea";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const cookies = new Cookies(null, { path: "/" });

const access_token = cookies.get("access_token");

const CreateProductSchema = z.object({
  product_name: z.string().min(0, "Il nome del prodotto è richiesto"),
  description: z.string().min(0, "La descrizione del prodotto è richiesta"),
  variants: z.array(
    z.object({
      sku: z.string().min(0, "Il campo SKU è richiesto"),
      size: z.string().min(0, "Il campo Taglia è richiesto"),
      price: z.number().min(0, "Il prezzo deve essere maggiore di zero"),
      stock: z.number().min(0, "Lo stock deve essere maggiore o uguale a zero"),
    })
  ),
});

export default function CreateProductPage() {
  const [product, setProduct] = useState<SimpleProduct | null>(null);
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(CreateProductSchema), // Resolver per la validazione dello schema con Zod
    defaultValues: {
      product_name: "",
      description: "",
      variants: [], // Inizializza variants come un array vuoto
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants",
  });

  function onSubmitCreateProduct(data: z.infer<typeof CreateProductSchema>) {
    console.log(data);
  }

  // Funzione per gestire l'invio del form
  const onSubmit = (data: z.infer<typeof CreateProductSchema>) => {
    data.variants.forEach((variant) => {
      variant.price = Number(variant.price);
      variant.stock = Number(variant.stock);
    });
    console.log(data); // Stampa i dati del form quando viene inviato
    // Puoi gestire qui la logica di invio al backend, ad esempio con fetch o Axios
  };

  // Funzione per aggiungere una nuova variante al form
  const addVariant = () => {
    append({ sku: "", size: "", price: 0, stock: 0 });
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

  // Funzione che aggiunge il prodotto dal Database
  async function addProduct() {
    try {
      const response = await fetch(`http://localhost:3000/product/add`, {
        method: "POST",
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
              <BreadcrumbLink asChild>
                <Link to="/prodotti">Prodotti</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Aggiungi prodotto</BreadcrumbPage>
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
        <div className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4">
          <div className="flex items-center gap-4">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                Aggiungi un prodotto
              </h1>
              <div className="hidden items-center gap-2 md:ml-auto md:flex">
                <Button size="sm" type="submit">
                  Aggiungi
                </Button>
              </div>
              <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
                <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
                  <Card x-chunk="dashboard-07-chunk-0">
                    <CardHeader>
                      <CardTitle>Dettagli</CardTitle>
                    </CardHeader>

                    <CardContent>
                      <div className="grid gap-6">
                        <div className="grid gap-3">
                          <Label htmlFor="product_name">Nome</Label>
                          <Input
                            {...register("product_name")}
                            id="product_name"
                            type="text"
                            className="w-full"
                          />
                          {errors.product_name && (
                            <span className="text-red-500">
                              {errors.product_name.message}
                            </span>
                          )}
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="description">Descrizione</Label>
                          <Textarea
                            {...register("description")}
                            id="description"
                            className="min-h-32"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  {/* DISPONIBILITA E VARIANTI */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Creazione Prodotto</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Varianti
                          </label>
                          <div className="space-y-4">
                            {fields.map((variant, index) => (
                              <div
                                key={variant.id}
                                className="flex flex-wrap space-x-4 items-center mb-4"
                              >
                                <div className="flex-1">
                                  <label
                                    htmlFor={`variants[${index}].sku`}
                                    className="block text-sm font-medium text-gray-700"
                                  >
                                    SKU
                                  </label>
                                  <input
                                    id={`variants[${index}].sku`}
                                    type="text"
                                    {...register(`variants[${index}].sku`)}
                                    defaultValue={variant.sku}
                                    className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                                  />
                                  {errors.variants?.[index]?.sku && (
                                    <span className="text-red-500">
                                      {errors.variants[index]?.sku.message}
                                    </span>
                                  )}
                                </div>
                                <div className="flex-1">
                                  <label
                                    htmlFor={`variants[${index}].size`}
                                    className="block text-sm font-medium text-gray-700"
                                  >
                                    Taglia
                                  </label>
                                  <Controller
                                    control={control}
                                    name={`variants[${index}].size`}
                                    defaultValue={variant.size}
                                    render={({ field }) => (
                                      <ToggleGroup
                                        id={`variants[${index}].size`}
                                        type="single"
                                        variant="outline"
                                        value={field.value}
                                        onValueChange={(value) =>
                                          field.onChange(value)
                                        }
                                      >
                                        <ToggleGroupItem value="S">
                                          S
                                        </ToggleGroupItem>
                                        <ToggleGroupItem value="M">
                                          M
                                        </ToggleGroupItem>
                                        <ToggleGroupItem value="L">
                                          L
                                        </ToggleGroupItem>
                                      </ToggleGroup>
                                    )}
                                  />

                                  {errors.variants?.[index]?.size && (
                                    <span className="text-red-500">
                                      {errors.variants[index]?.size.message}
                                    </span>
                                  )}
                                </div>
                                <div className="flex-1">
                                  <label
                                    htmlFor={`variants[${index}].price`}
                                    className="block text-sm font-medium text-gray-700"
                                  >
                                    Prezzo
                                  </label>
                                  <input
                                    id={`variants[${index}].price`}
                                    type="number"
                                    {...register(`variants[${index}].price`, {
                                      valueAsNumber: true,
                                    })}
                                    defaultValue={variant.price}
                                    className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                                  />
                                  {errors.variants?.[index]?.price && (
                                    <span className="text-red-500">
                                      {errors.variants[index]?.price.message}
                                    </span>
                                  )}
                                </div>
                                <div className="flex-1">
                                  <label
                                    htmlFor={`variants[${index}].stock`}
                                    className="block text-sm font-medium text-gray-700"
                                  >
                                    Stock
                                  </label>
                                  <input
                                    id={`variants[${index}].stock`}
                                    type="number"
                                    {...register(`variants[${index}].stock`, {
                                      valueAsNumber: true,
                                    })}
                                    defaultValue={variant.stock}
                                    className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                                  />
                                  {errors.variants?.[index]?.stock && (
                                    <span className="text-red-500">
                                      {errors.variants[index]?.stock.message}
                                    </span>
                                  )}
                                </div>
                                <div className="flex-none">
                                  <button
                                    type="button"
                                    onClick={() => remove(index)}
                                    className="flex items-center justify-center"
                                  >
                                    <CircleMinus className="h-5 w-5 mt-5" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="justify-center border-t p-4">
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        className="gap-1"
                        onClick={addVariant}
                      >
                        <PlusCircle className="h-3.5 w-3.5" />
                        Aggiungi variante
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
                {/* STATO */}
                <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
                  <Card x-chunk="dashboard-07-chunk-3">
                    <CardHeader>
                      <CardTitle>Stato prodotto</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-6">
                        <div className="grid gap-3">
                          <Label htmlFor="status">Stato</Label>
                          <Select>
                            <SelectTrigger
                              id="status"
                              aria-label="Seleziona stato"
                            >
                              <SelectValue placeholder={product?.status} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="bozza">
                                {product?.status === "Bozza" ? (
                                  <span className="flex items-center">
                                    Bozza
                                    <Check className="h-3 w-3 text-emerald-600 ml-1" />
                                  </span>
                                ) : (
                                  <>Bozza</>
                                )}
                              </SelectItem>

                              <SelectItem value="attivo">
                                {product?.status === "Attivo" ? (
                                  <span className="flex items-center">
                                    Attivo
                                    <Check className="h-3 w-3 text-emerald-600 ml-1" />
                                  </span>
                                ) : (
                                  <>Attivo</>
                                )}
                              </SelectItem>

                              <SelectItem value="archiviato">
                                {product?.status === "Archiviato" ? (
                                  <span className="flex items-center">
                                    Archiviato
                                    <Check className="h-3 w-3 text-emerald-600 ml-1" />
                                  </span>
                                ) : (
                                  <>Archiviato</>
                                )}
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  {/* CATEGORIA */}
                  <Card x-chunk="dashboard-07-chunk-2">
                    <CardHeader>
                      <CardTitle>Categoria prodotto</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-9 sm:grid-cols-1">
                        <div>
                          <Label htmlFor="category">Categoria</Label>
                          <Select>
                            <SelectTrigger
                              id="category"
                              aria-label={product?.category}
                            >
                              <SelectValue placeholder={product?.category} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="accessori">
                                Accessori
                              </SelectItem>
                              <SelectItem value="elettronica">
                                Elettronica
                              </SelectItem>
                              <SelectItem value="abbigliamento">
                                Abbigliamento
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="subcategory">Sottocategoria</Label>
                          <Select>
                            <SelectTrigger
                              id="subcategory"
                              aria-label={product?.sub_category}
                            >
                              <SelectValue
                                placeholder={product?.sub_category}
                              />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="t-shirts">T-Shirts</SelectItem>
                              <SelectItem value="hoodies">Hoodies</SelectItem>
                              <SelectItem value="sweatshirts">
                                Sweatshirts
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  {/* IMMAGINI */}
                  <Card
                    className="overflow-hidden"
                    x-chunk="dashboard-07-chunk-4"
                  >
                    <CardHeader>
                      <CardTitle>Immagini prodotto</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-2">
                        <img
                          alt="Product image"
                          className="aspect-square w-full rounded-md object-cover"
                          height="300"
                          src="/placeholder.svg"
                          width="300"
                        />
                        <div className="grid grid-cols-3 gap-2">
                          <button>
                            <img
                              alt="Product image"
                              className="aspect-square w-full rounded-md object-cover"
                              height="84"
                              src="/placeholder.svg"
                              width="84"
                            />
                          </button>
                          <button>
                            <img
                              alt="Product image"
                              className="aspect-square w-full rounded-md object-cover"
                              height="84"
                              src="/placeholder.svg"
                              width="84"
                            />
                          </button>
                          <button className="flex aspect-square w-full items-center justify-center rounded-md border border-dashed">
                            <Upload className="h-4 w-4 text-muted-foreground" />
                            <span className="sr-only">Upload</span>
                          </button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
