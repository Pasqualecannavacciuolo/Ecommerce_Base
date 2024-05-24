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

const formSchema = z.object({
  name: z
    .string()
    .min(2, "Il nome deve essere lungo almeno 2 caratteri")
    .max(75),
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

export default function SignUpPage() {
  const { toast } = useToast();

  // 1. Dichiaro il form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  // 2. Definisco un handler per effettuare il submit
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // ✅ I dati qui saranno type-safe e validati.
    try {
      const response = await fetch("http://localhost:3000/register", {
        method: "POST",
        body: JSON.stringify(values),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });
      console.log(response);
      toast({
        title: "Azione eseguita ✅",
        description: "Hai appena creato un utente con successo",
      });
    } catch (error) {
      console.log(error);
    }
    console.log(values);
  }

  return (
    <div className="flex h-screen">
      <Card className="m-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-xl">Registra un utente</CardTitle>
          <CardDescription>
            Inserisci le informazioni per creare un utente che potra gestire la
            dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input placeholder="Mario Rossi" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                <Button type="submit">Registra</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
