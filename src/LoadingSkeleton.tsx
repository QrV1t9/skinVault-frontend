import {Button} from "@/components/ui/button.tsx";
import {Clipboard, Download, Trash2} from "lucide-react";
import {Skeleton} from "@/components/ui/skeleton";

export default function LoadingSkeleton() {

    return (
        <>
            <header className="flex p-2 justify-between items-center border-solid border-b-4 border-gray-700">
                <Button>Add new skin</Button>
            </header>
            <main>
                <div
                    className="h-[28rem] items-center justify-center inline-flex flex-col border-2 rounded-xl border-gray-700 m-10">
                    <div
                        className="w-full text-center font-bold font-size pb-2 text-3xl border-b-2 border-b-gray-700">Loading...</div>
                    <div className="w-full flex justify-center pb-5 pt-5">
                        <Skeleton className="h-72 w-32 rounded-2xl"></Skeleton>
                    </div>
                    <div className="border-t-2 border-t-gray-700 pt-2 pr-4 pl-4 w-full justify-center flex">
                        <Button><Clipboard/></Button>
                        <Button variant="destructive" className="mr-5 ml-5"><Trash2/></Button>
                        <Button><Download/></Button>
                    </div>
                </div>
            </main>
        </>
)
}