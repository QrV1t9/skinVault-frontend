import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import axios from "axios"
import { Trash2, Download, Clipboard } from "lucide-react"
const downloadFile = (url: string, fileName: string) => {
    axios.get(url)
        .then(response => {
            const href = window.URL.createObjectURL(response.data);

            const anchorElement = document.createElement('a');

            anchorElement.href = href;
            anchorElement.download = fileName;

            document.body.appendChild(anchorElement);
            anchorElement.click();

            document.body.removeChild(anchorElement);
            window.URL.revokeObjectURL(href);
        })
        .catch(error => {
            console.log('error: ', error);
        });
}

interface Props {
    isSlim: boolean,
    skin_id: number,
    skinname: string,
    skinsource: string,
}

export default function SkinsCard({ isSlim, skin_id, skinname, skinsource }: Props) {
    const { toast } = useToast()
    const expression = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi;
    const regex = new RegExp(expression);
    if (skinsource.match(regex)) {
        if (isSlim) {
            return (
                <div
                    className="h-[28rem] items-center justify-center inline-flex flex-col border-2 rounded-xl border-gray-700 m-10">
                    <div
                        className="w-full text-center font-bold font-size pb-2 text-3xl border-b-2 border-b-gray-700">{skinname}</div>
                    <div className="w-full flex justify-center pb-5 pt-5">
                        <img
                            src={`https://starlightskins.lunareclipse.studio/render/ultimate/Null/full?skinUrl=${skinsource}`}
                            alt="" className="w-32 h-72"/>
                    </div>
                    <div className="border-t-2 border-t-gray-700 pt-2 w-full pr-4 pl-4  justify-center flex">
                        <Button onClick={() => {
                            toast({
                                title: "Command copied in your clipboard.",
                                description: "Just paste it in game chat!",
                            })
                            navigator.clipboard.writeText(`/skin url ${skinsource} CLASSIC`)
                        }}><Clipboard /></Button>
                        <Button variant="destructive" className="mr-5 ml-5" onClick={() => {
                            axios.delete(`https://lalkaxz-server.loca.lt/skins/remove/${skin_id}`, {
                                headers: {
                                    'Authorization': `Bearer ${localStorage.getItem("token")}`
                                }
                            }).then(() => {
                                    window.location.reload()
                            }
                            )
                        }}><Trash2 /></Button>
                        <Button onClick={() => {
                            downloadFile(skinsource, "skin");
                        }}><Download /></Button>
                    </div>

                </div>

        )
        } else {
            return (
                <div
                    className="h-[28rem] items-center justify-center inline-flex flex-col border-2 rounded-xl border-gray-700 m-10">
                    <div
                        className="w-full text-center font-bold font-size pb-2 text-3xl border-b-2 border-b-gray-700">{skinname}</div>
                    <div className="w-full flex justify-center pb-5 pt-5">
                        <img
                            src={`https://starlightskins.lunareclipse.studio/render/ultimate/Null/full?skinUrl=${skinsource}`}
                            alt="" className="w-32 h-72"/>
                    </div>
                    <div className="border-t-2 border-t-gray-700 pt-2 pr-4 pl-4 w-full justify-center flex">
                        <Button onClick={() => {
                            toast({
                                title: "Command copied in your clipboard.",
                                description: "Just paste it in game chat!",
                            })
                            navigator.clipboard.writeText(`/skin url ${skinsource} SLIM`)
                        }}><Clipboard /></Button>
                        <Button variant="destructive" className="mr-5 ml-5" onClick={() => {
                            axios.delete(`https://lalkaxz-server.loca.lt/skins/remove/${skin_id}`, {
                                headers: {
                                    'Authorization': `Bearer ${localStorage.getItem("token")}`
                                }
                            }).then(() => window.location.reload())
                        }}><Trash2 /></Button>
                        <Button onClick={() => {
                            downloadFile(skinsource, "skin");
                        }}><Download /></Button>
                    </div>

                </div>
        )
        }
    } else {
        return (
            <div
                className="h-[28rem] items-center justify-center inline-flex flex-col border-2 rounded-xl border-gray-700 m-10">
                <div
                    className="w-full text-center font-bold font-size pb-2 text-3xl border-b-2 border-b-gray-700">{skinname}</div>
                <div className="w-full flex justify-center pb-5 pt-5">
                    <img src={`https://starlightskins.lunareclipse.studio/render/ultimate/${skinsource}/full`}
                         alt="" className="w-32 h-72"/>
                </div>
                <div className="border-t-2 border-t-gray-700 pt-2 pr-4 pl-4 w-full justify-center flex">
                    <Button title="Copy command" onClick={() => {
                        toast({
                            title: "Command copied in your clipboard.",
                            description: "Just paste it in game chat!",
                        })
                        navigator.clipboard.writeText(`/skin set ${skinsource}`)
                    }}><Clipboard /></Button>
                    <Button title="Delete" variant="destructive" className="mr-5 ml-5" onClick={() => {
                        axios.delete(`https://lalkaxz-server.loca.lt/skins/remove/${skin_id}`, {
                            headers: {
                                'Authorization': `Bearer ${localStorage.getItem("token")}`
                            }
                        }).then(() => window.location.reload())
                    }}><Trash2 /></Button>
                    <Button title="Download" onClick={() => {
                        window.location.href = `https://mineskin.eu/download/${skinsource}`
                    }}><Download /></Button>
                </div>
            </div>
        )
    }
}