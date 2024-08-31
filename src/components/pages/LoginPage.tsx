import { Input } from "@/components/ui/input.tsx"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form.tsx"
import { Button } from "@/components/ui/button.tsx"
import { Link } from 'react-router-dom'
import axios from "axios";
import {useState} from "react";

export default function LoginPage() {
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const FormSchema = z.object({
        username: z.string().max(20).trim().min(2, {
            message: "Username must be at least 2 characters.",
        }),
        password: z.string().max(32).trim().min(4, {
            message: "Password must be at least 4 characters."
        }),
    })
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            username: "",
            password: "",
        },
    })

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        // const response = await axios.post("https://lalkaxz-server.loca.lt/user/login", {login: data.username, password: data.password});
        // localStorage.setItem("token", response.data.token)
        // window.location.replace("http://localhost:5173/")
        try {
            setErrorMessage(null)
            const response = await axios.post("https://lalkaxz-server.loca.lt/user/login", { login: data.username, password: data.password })
            localStorage.setItem("token", response.data.token)
            window.location.replace("http://localhost:5173/")
        } catch (error: any) {
            if (error.response && error.response.status === 404) {
                setErrorMessage("Incorrect username or password.")
            } else {
                setErrorMessage("An unexpected error occurred. Please try again later.")
            }
        }
    }

    return (
        <div className="min-w-full min-h-screen flex items-center justify-center">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-96">
                    <FormField control={form.control} name="username" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                                <Input placeholder="Username" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}/>
                    <FormField control={form.control} name="password" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input type={"password"} placeholder="Password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}/>
                    {errorMessage && (
                        <div className="mb-4 text-red-500">
                            {errorMessage}
                        </div>
                    )}
                    <div className="flex justify-between items-center mt-5">
                        <Button type="submit">Submit</Button>
                        <Button type="button" className="ml-10"><Link to="/register">Back to register</Link></Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}