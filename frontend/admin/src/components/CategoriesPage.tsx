import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@radix-ui/react-dropdown-menu";
import { Link } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "./ui/breadcrumb";
import { Input } from "./ui/input";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import { useEffect, useState } from "react";
import { Category } from "@/models/models";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "./ui/card";

const CategoriesFormSchema = z.object({
  categories: z.array(
    z.object({
      id: z.number(),
      activeStatus: z.boolean(),
    })
  ),
});

const SubCategoriesFormSchema = z.object({
  subCategories: z.array(
    z.object({
      id: z.number(),
      activeStatus: z.boolean(),
    })
  ),
});

const cookies = new Cookies(null, { path: "/" });

const access_token = cookies.get("access_token");

export default function CategoriesPage() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState<Category[] | []>([]);
  const [subCategories, setSubCategories] = useState<Category[] | []>([]);

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

  const categories_form = useForm<z.infer<typeof CategoriesFormSchema>>({
    resolver: zodResolver(CategoriesFormSchema),
    defaultValues: {
      categories: categories.map((category) => ({
        id: category.id,
        activeStatus: category.active || false,
      })),
    },
  });

  const sub_categories_form = useForm<z.infer<typeof SubCategoriesFormSchema>>({
    resolver: zodResolver(SubCategoriesFormSchema),
    defaultValues: {
      subCategories: subCategories.map((sub_category) => ({
        id: sub_category.id,
        activeStatus: sub_category.active || false,
      })),
    },
  });

  async function onSubmitCategories(
    data: z.infer<typeof CategoriesFormSchema>
  ) {
    try {
      // Itera sulle categorie per inviare una richiesta per ciascuna
      for (const category of data.categories) {
        const response = await fetch(
          `http://localhost:3000/category/modifyStatus/${category.id}`,
          {
            method: "PUT",
            headers: {
              "Content-type": "application/json; charset=UTF-8",
              Authorization: access_token,
            },
            body: JSON.stringify({ activeStatus: category.activeStatus }),
          }
        );

        if (!response.ok) {
          throw new Error("Errore durante il fetch delle categorie!");
        }

        const responseData = await response.json();
        toast({
          title: "Messaggio",
          description: <p>{responseData.message}</p>,
        });
      }
    } catch (error) {
      console.log(error);
      // Gestisci il caso in cui l'access_token sia scaduto
      if (error instanceof Error && error.message.includes("401")) {
        // Prova a fare il refresh del token o chiedi all'utente di autenticarsi di nuovo
      }
    }
  }

  async function onSubmitSubCategories(
    data: z.infer<typeof SubCategoriesFormSchema>
  ) {
    try {
      // Itera sulle categorie per inviare una richiesta per ciascuna
      for (const sub_category of data.subCategories) {
        const response = await fetch(
          `http://localhost:3000/sub_category/modifyStatus/${sub_category.id}`,
          {
            method: "PUT",
            headers: {
              "Content-type": "application/json; charset=UTF-8",
              Authorization: access_token,
            },
            body: JSON.stringify({ activeStatus: sub_category.activeStatus }),
          }
        );

        if (!response.ok) {
          throw new Error("Errore durante il fetch delle sottocategorie!");
        }

        const responseData = await response.json();
        toast({
          title: "Messaggio",
          description: <p>{responseData.message}</p>,
        });
      }
    } catch (error) {
      console.log(error);
      // Gestisci il caso in cui l'access_token sia scaduto
      if (error instanceof Error && error.message.includes("401")) {
        // Prova a fare il refresh del token o chiedi all'utente di autenticarsi di nuovo
      }
    }
  }

  // Ottengo al caricamento della pagina i dati dal database e li ordino per nome
  useEffect(() => {
    async function getCategoriesAndSubCategoriesFromDB() {
      const fetchedCategories = await getCategories();
      const sortedCategories = fetchedCategories.sort(
        (a: { name: string }, b: { name: string }) =>
          a.name.localeCompare(b.name)
      );
      setCategories(sortedCategories);

      const fetchedSubCategories = await getSubCategories();
      const sortedSubCategories = fetchedSubCategories.sort(
        (a: { name: string }, b: { name: string }) =>
          a.name.localeCompare(b.name)
      );
      setSubCategories(sortedSubCategories);
    }
    getCategoriesAndSubCategoriesFromDB();
  }, []);

  // Setto lo stato delle checkbox al caricamento della pagina sulla base dello stato attivo/non attivo delle cateogrie
  useEffect(() => {
    const sortedCategories = [...categories].sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    categories_form.reset({
      categories: sortedCategories.map((category) => ({
        id: category.id,
        activeStatus: category.active || false,
      })),
    });

    const sortedSubCategories = [...subCategories].sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    sub_categories_form.reset({
      subCategories: sortedSubCategories.map((sub_category) => ({
        id: sub_category.id,
        activeStatus: sub_category.active || false,
      })),
    });
  }, [categories, subCategories]);

  // Funzione che ottiene tutte el categorie dal Database
  async function getCategories() {
    try {
      const response = await fetch("http://localhost:3000/category/get", {
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

  // Funzione che ottiene tutte el sottocategorie dal Database
  async function getSubCategories() {
    try {
      const response = await fetch("http://localhost:3000/sub_category/get", {
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
              <BreadcrumbPage>Categorie</BreadcrumbPage>
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
          <Card className="" x-chunk="dashboard-05-chunk-0">
            <CardHeader className="pb-3">
              <CardTitle>Le tue categorie</CardTitle>
              <CardDescription className="max-w-lg text-balance leading-relaxed">
                In questa pagina potrai controllare tutte le categorie e
                sottocategoria del tuo sito, potrai renderle attive o
                disattivarle, inoltre potrai anche crearne di nuove.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button>Crea una categoria</Button>
            </CardFooter>
          </Card>
          <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
            {/* FORM CATEGORIE */}
            <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
              <Form {...categories_form}>
                <form
                  onSubmit={categories_form.handleSubmit(onSubmitCategories)}
                  className="space-y-8"
                >
                  <FormField
                    control={categories_form.control}
                    name="categories"
                    render={({ field }) => (
                      <FormItem>
                        <div className="mb-4">
                          <FormLabel className="text-base">Categorie</FormLabel>
                          <FormDescription>
                            Seleziona le categorie da rendere attive
                          </FormDescription>
                        </div>
                        {categories.map((category) => {
                          const isChecked = field.value.some(
                            (c) => c.id === category.id && c.activeStatus
                          );
                          return (
                            <FormItem
                              key={category.id}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={isChecked}
                                  onCheckedChange={(checked) => {
                                    const updatedCategories = checked
                                      ? [
                                          ...field.value,
                                          {
                                            id: category.id,
                                            activeStatus: true,
                                          },
                                        ]
                                      : field.value.map((c) =>
                                          c.id === category.id
                                            ? { ...c, activeStatus: false }
                                            : c
                                        );
                                    field.onChange(updatedCategories);
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-normal">
                                {category.name}
                              </FormLabel>
                            </FormItem>
                          );
                        })}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit">Salva</Button>
                </form>
              </Form>
            </div>
            {/* FORM SOTTOCATEGORIE */}
            <div className="grid auto-rows-max items-start gap-4 lg:col-span-1 lg:gap-8">
              <Form {...sub_categories_form}>
                <form
                  onSubmit={sub_categories_form.handleSubmit(
                    onSubmitSubCategories
                  )}
                  className="space-y-8"
                >
                  <FormField
                    control={sub_categories_form.control}
                    name="subCategories"
                    render={({ field }) => (
                      <FormItem>
                        <div className="mb-4">
                          <FormLabel className="text-base">
                            Sottocategorie
                          </FormLabel>
                          <FormDescription>
                            Seleziona le sottocategorie da rendere attive
                          </FormDescription>
                        </div>
                        {subCategories.map((sub_category) => {
                          const isChecked = field.value.some(
                            (c) => c.id === sub_category.id && c.activeStatus
                          );
                          return (
                            <FormItem
                              key={sub_category.id}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={isChecked}
                                  onCheckedChange={(checked) => {
                                    const updatedSubCategories = checked
                                      ? [
                                          ...field.value,
                                          {
                                            id: sub_category.id,
                                            activeStatus: true,
                                          },
                                        ]
                                      : field.value.map((c) =>
                                          c.id === sub_category.id
                                            ? { ...c, activeStatus: false }
                                            : c
                                        );
                                    field.onChange(updatedSubCategories);
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-normal">
                                {sub_category.name}
                              </FormLabel>
                            </FormItem>
                          );
                        })}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit">Salva</Button>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
