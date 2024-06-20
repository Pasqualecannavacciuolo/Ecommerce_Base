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
import { Search, PlusCircle, Upload, CircleMinus } from "lucide-react";
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
  product_name: z.string().min(1, "Il nome del prodotto è richiesto"),
  description: z.string().min(1, "La descrizione del prodotto è richiesta"),
  variants: z.array(
    z.object({
      sku: z.string().min(1, "Campo obbligatorio"),
      size: z.string().min(1, "Campo obbligatorio"),
      price: z.number(),
      stock: z.number(),
    })
  ),
  status: z.string().min(1, "Lo status del prodotto deve essere specificato"),
  category: z
    .string()
    .min(1, "Lo categoria del prodotto deve essere specificata"),
  sub_category: z
    .string()
    .min(1, "Lo sottocategoria del prodotto deve essere specificata"),
});

export default function CreateProductPage() {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(CreateProductSchema),
    defaultValues: {
      product_name: "",
      description: "",
      variants: [],
      status: "",
      category: "",
      sub_category: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants",
  });

  // Funzione per gestire l'invio del form
  const onSubmit = (data: z.infer<typeof CreateProductSchema>) => {
    data.variants.forEach((variant) => {
      variant.price = Number(variant.price);
      variant.stock = Number(variant.stock);
    });
    addProduct(data);
  };

  const onError = (errors: unknown) => {
    console.log("Form Errors:", errors);
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
  async function addProduct(product: z.infer<typeof CreateProductSchema>) {
    try {
      const response = await fetch(`http://localhost:3000/product/add`, {
        method: "POST",
        body: JSON.stringify(product),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          Authorization: access_token,
        },
      });

      if (!response.ok) {
        throw new Error("Errore durante la creazione del prodotto");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.log(error);
      // Gestisci il caso in cui l'access_token sia scaduto
      if (error instanceof Error && error.message.includes("401")) {
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
            <form
              onSubmit={handleSubmit(onSubmit, onError)}
              className="space-y-4"
            >
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
                            <span className="text-red-500 text-sm">
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
                          {errors.description && (
                            <span className="text-red-500 text-sm">
                              {errors.description.message}
                            </span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  {/* DISPONIBILITA E VARIANTI */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Varianti</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4">
                        <div>
                          <div className="space-y-4">
                            {fields.map((variant, index) => (
                              <div
                                key={variant.id}
                                className="grid grid-cols-12 gap-4 items-center mb-4"
                              >
                                {/* SKU */}
                                <div className="col-span-3">
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
                                    <span className="text-red-500 text-xs">
                                      {errors.variants[index]?.sku.message}
                                    </span>
                                  )}
                                </div>
                                {/* TAGLIA */}
                                <div className="col-span-3">
                                  <label
                                    htmlFor={`variants[${index}].size`}
                                    className="block text-sm font-medium text-gray-700 mb-2"
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
                                    <span className="text-red-500 text-xs">
                                      {errors.variants[index]?.size.message}
                                    </span>
                                  )}
                                </div>
                                {/* PREZZO */}
                                <div className="col-span-2">
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
                                </div>
                                {/* STOCK */}
                                <div className="col-span-2">
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
                                </div>
                                {/* REMOVE BUTTON */}
                                <div className="col-span-1 flex items-center mt-5">
                                  <button
                                    type="button"
                                    onClick={() => remove(index)}
                                    className="flex items-center justify-center text-red-500"
                                  >
                                    <CircleMinus className="h-5 w-5" />
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
                          <Controller
                            control={control}
                            name="status"
                            render={({ field }) => (
                              <Select onValueChange={field.onChange}>
                                <SelectTrigger
                                  id="status"
                                  aria-label="Seleziona stato"
                                >
                                  <SelectValue
                                    placeholder="Seleziona stato"
                                    {...field}
                                  />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Bozza">Bozza</SelectItem>
                                  <SelectItem value="Attivo">Attivo</SelectItem>
                                  <SelectItem value="Archiviato">
                                    Archiviato
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            )}
                          />
                          {errors.status && (
                            <span className="text-red-500 text-sm">
                              {errors.status.message}
                            </span>
                          )}
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
                      <div className="grid gap-6">
                        <div className="grid gap-3">
                          <Label htmlFor="category">Categoria</Label>
                          <Controller
                            control={control}
                            name="category"
                            render={({ field }) => (
                              <Select onValueChange={field.onChange}>
                                <SelectTrigger
                                  id="category"
                                  aria-label="Seleziona categoria"
                                >
                                  <SelectValue
                                    placeholder="Seleziona categoria"
                                    {...field}
                                  />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Accessori">
                                    Accessori
                                  </SelectItem>
                                  <SelectItem value="Elettronica">
                                    Elettronica
                                  </SelectItem>
                                  <SelectItem value="Abbigliamento">
                                    Abbigliamento
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            )}
                          />
                          {errors.category && (
                            <span className="text-red-500 text-sm">
                              {errors.category.message}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="grid gap-6 mt-5">
                        <div className="grid gap-3">
                          <Label htmlFor="sub_category">Sottocategoria</Label>
                          <Controller
                            control={control}
                            name="sub_category"
                            render={({ field }) => (
                              <Select onValueChange={field.onChange}>
                                <SelectTrigger
                                  id="sub_category"
                                  aria-label="Seleziona sottocategoria"
                                >
                                  <SelectValue
                                    placeholder="Seleziona sottocategoria"
                                    {...field}
                                  />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Magliette">
                                    Magliette
                                  </SelectItem>
                                  <SelectItem value="Pantaloni">
                                    Pantaloni
                                  </SelectItem>
                                  <SelectItem value="Scarpe">Scarpe</SelectItem>
                                </SelectContent>
                              </Select>
                            )}
                          />
                          {errors.sub_category && (
                            <span className="text-red-500 text-sm">
                              {errors.sub_category.message}
                            </span>
                          )}
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
