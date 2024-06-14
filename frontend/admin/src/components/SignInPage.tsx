import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "./ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";

const cookies = new Cookies(null, { path: "/" });

const formSchema = z.object({
  email: z
    .string()
    .email({ message: "Questa email non e' valida" })
    .min(8, "L'email deve essere lunga almeno 8 caratteri")
    .max(100),
  password: z
    .string()
    .min(8, "La password deve essere lunga almeno 8 caratteri")
    .max(50),
});

export default function SignInPage() {
  const { toast } = useToast();
  const navigate = useNavigate();

  // 1. Dichiaro il form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 2. Definisco un handler per effettuare il submit
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // ✅ I dati qui saranno type-safe e validati.
    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        body: JSON.stringify(values),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });
      const data = await response.json();
      // Se c'e un Internal Server Error
      if (data.status === 500) {
        toast({
          title: "Internal Server Error ❌",
          description: "Controlla che il database sia acceso e funzionante",
        });
        return;
        //navigate("/sign-up");
      }
      if (response) {
        cookies.set("access_token", data.token, {
          path: "/",
        });
        cookies.set("user_email", data.email);
      }
      toast({
        title: "Accesso eseguito ✅",
      });
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="mx-auto max-w-sm w-full">
        <CardHeader>
          <CardTitle className="text-xl">Accedi</CardTitle>
          <CardDescription>Accedi alla tua dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="nome@email.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Accedi</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
