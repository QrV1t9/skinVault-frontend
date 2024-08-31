import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {z} from "zod"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {useEffect, useState} from "react";
import { DialogClose } from "@radix-ui/react-dialog"
import SkinsCard from "@/components/SkinsCard.tsx";
import axios from "axios";
import LoadingSkeleton from "@/LoadingSkeleton.tsx";

export default function Landing() {
    const [isLoading, setLoading] = useState(true)
    const [skins, setSkins] = useState()
    const imgbbAPIKey = "c8be40cd75128eab7cde9aae3de74524"
    const [type, setType] = useState("file")
    const FormSchema = z.object({
        name: z.string().max(15).trim().min(1, {
            message: "Name must be at least 1 char"
        }),
        isSlim: z.enum(["False", "True"], {
            required_error: "You need to select a skin type"
        }),
        type: z.enum(["file", "username"], {
            required_error: "You need to select a skin type.",
        }),
        file: z.any().optional(),
        username: z.string().max(32).min(2, {
            message: "Username is must presented"
        }).optional(),
}).refine((data) => {
    if (data.type === "file") {
        return data.file && data.file.length > 0;
    }
    if (data.type === "username") {
        return !!data.username;
    }
    return false;
}, {
    message: "You must provide either a file or a username.",
    path: ["file"],
});

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: '',
            isSlim: 'False',
            type: "file"
        }
    })

   const onSubmit = (data) => {
        if (data.type === "file" && data.file?.[0]) {
        const file = data.file[0] as File;
        const formData = new FormData();
        formData.append("image", file)
        try {
            axios.post(`https://api.imgbb.com/1/upload?key=${imgbbAPIKey}`, formData)
                .then((response) => {
                    if (response.status === 200) {
                        axios.post("https://lalkaxz-server.loca.lt/skins", {
                            skinName: data.name,
                            isslim: data.isSlim,
                            skinsource: response.data.data.url
                        }, {
                            headers: {
                                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                                "Access-Control-Allow-Origin": "*"
                            },
                        }).then(() => {
                                getSkins()
                            }
                        )
                    } else {
                        console.error("Upload failed:", response);
                    }
                })

            } catch (error) {
                console.error("Error uploading to imgbb:", error);
            }
        } else if (data.type === "username") {
           axios.post("https://lalkaxz-server.loca.lt/skins", {
               skinName: data.name,
               isslim: data.isSlim,
               skinsource: data.username
           }, {
               headers: {
                   "Authorization": `Bearer ${localStorage.getItem("token")}`,
                   "Access-Control-Allow-Origin": 1
               },
           }).then(() => {
               getSkins()
           })
       }
   }
   async function getSkins() {
        setLoading(true)
        const res = await axios.get("https://lalkaxz-server.loca.lt/skins", {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "Access-Control-Allow-Origin": 1
            }
        })
       setLoading(false)
       setSkins(res.data)
   }
    useEffect(() => {
        getSkins();
    }, []);
    if (isLoading) {
        return (
            <LoadingSkeleton />
        )
    } else {
        return (
            <>
                <header className="flex p-2 justify-between items-center border-solid border-b-4 border-gray-700">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button>Add new skin</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Add new skin</DialogTitle>
                                <DialogDescription>
                                    You can add new skin here. Click save when you're done.
                                </DialogDescription>
                            </DialogHeader>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
                                    <FormField control={form.control} name="name" render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Name" {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}/>
                                    <FormField
                                        control={form.control}
                                        name="type"
                                        render={({field}) => (
                                            <FormItem className="space-y-3">
                                                <FormLabel>Select skin get from</FormLabel>
                                                <FormControl>
                                                    <RadioGroup
                                                        onValueChange={(e) => {
                                                            form.setValue("type", e)
                                                            setType(e)
                                                        }}
                                                        defaultValue={field.value}
                                                        className="flex flex-col space-y-1"
                                                    >
                                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                                            <FormControl>
                                                                <RadioGroupItem value="file"/>
                                                            </FormControl>
                                                            <FormLabel className="font-normal">
                                                                File
                                                            </FormLabel>
                                                        </FormItem>
                                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                                            <FormControl>
                                                                <RadioGroupItem value="username"/>
                                                            </FormControl>
                                                            <FormLabel className="font-normal">
                                                                Username
                                                            </FormLabel>
                                                        </FormItem>
                                                    </RadioGroup>
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                    {type === "file" && (
                                        <FormField control={form.control} name="file" render={({field}) => (
                                            <FormItem>
                                                <FormLabel>File</FormLabel>
                                                <FormControl>
                                                    <Input className="cursor-pointer" accept="image/*" type="file"
                                                           onChange={(e) => {
                                                               const file = e.target.files?.[0];
                                                               field.onChange(file ? [file] : [])
                                                           }}
                                                    />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}/>
                                    )}
                                    {type === "username" && (
                                        <FormField control={form.control} name="username" render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Name of license</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Username" {...field} />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}/>
                                    )}
                                    <FormField
                                        control={form.control}
                                        name="isSlim"
                                        render={({field}) => (
                                            <FormItem className="space-y-3">
                                                <FormLabel>Select skin type</FormLabel>
                                                <FormControl>
                                                    <RadioGroup
                                                        onChange={field.onChange}
                                                        defaultValue={field.value}
                                                        className="flex flex-col space-y-1"
                                                    >
                                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                                            <FormControl>
                                                                <RadioGroupItem value="False"/>
                                                            </FormControl>
                                                            <FormLabel className="font-normal">
                                                                Alex
                                                            </FormLabel>
                                                        </FormItem>
                                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                                            <FormControl>
                                                                <RadioGroupItem value="True"/>
                                                            </FormControl>
                                                            <FormLabel className="font-normal">
                                                                Steve
                                                            </FormLabel>
                                                        </FormItem>
                                                    </RadioGroup>
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                    <DialogClose>
                                        <Button type="submit">Save changes</Button>
                                    </DialogClose>
                                </form>
                            </Form>
                        </DialogContent>
                    </Dialog>
                    <p className="font-bold mb-3 text-xl"></p>
                </header>
                <main>
                    {skins.map(skin =>
                        <SkinsCard skin={skin} key={`${skin.skinName}${skin.skin_id}`}/>
                    )}
                </main>
            </>

        )
    }
}
