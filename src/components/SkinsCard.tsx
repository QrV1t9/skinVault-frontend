import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import axios from "axios"
import { Trash2, Download, Clipboard } from "lucide-react"
function downloadFile(url, fileName) {
    return axios({
        url,
        method: 'GET',
        responseType: 'blob',
    })
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

export default function SkinsCard({ skin }) {
    const { toast } = useToast()
    const expression = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi;
    const regex = new RegExp(expression);
    if (skin.skinsource.match(regex)) {
        if (skin.isSlim) {
            return (
                <div
                    className="h-[28rem] items-center justify-center inline-flex flex-col border-2 rounded-xl border-gray-700 m-10">
                    <div
                        className="w-full text-center font-bold font-size pb-2 text-3xl border-b-2 border-b-gray-700">{skin.skinname}</div>
                    <div className="w-full flex justify-center pb-5 pt-5">
                        <img
                            src={`https://starlightskins.lunareclipse.studio/render/ultimate/Null/full?skinUrl=${skin.skinsource}`}
                            alt="" className="w-32 h-72"/>
                    </div>
                    <div className="border-t-2 border-t-gray-700 pt-2 w-full pr-4 pl-4  justify-center flex">
                        <Button onClick={() => {
                            toast({
                                title: "Command copied in your clipboard.",
                                description: "Just paste it in game chat!",
                            })
                            navigator.clipboard.writeText(`/skin url ${skin.skinsource} CLASSIC`)
                        }}><Clipboard /></Button>
                        <Button variant="destructive" className="mr-5 ml-5" onClick={() => {
                            axios.delete(`https://lalkaxz-server.loca.lt/skins/remove/${skin.skin_id}`, {
                                headers: {
                                    'Authorization': `Bearer ${localStorage.getItem("token")}`
                                }
                            }).then(() => {
                                    window.location.reload()
                            }
                            )
                        }}><Trash2 /></Button>
                        <Button onClick={() => {
                            downloadFile(skin.skinsource, "skin");
                        }}><Download /></Button>
                    </div>

                </div>

        )
        } else {
            return (
                <div
                    className="h-[28rem] items-center justify-center inline-flex flex-col border-2 rounded-xl border-gray-700 m-10">
                    <div
                        className="w-full text-center font-bold font-size pb-2 text-3xl border-b-2 border-b-gray-700">{skin.skinname}</div>
                    <div className="w-full flex justify-center pb-5 pt-5">
                        <img
                            src={`https://starlightskins.lunareclipse.studio/render/ultimate/Null/full?skinUrl=${skin.skinsource}`}
                            alt="" className="w-32 h-72"/>
                    </div>
                    <div className="border-t-2 border-t-gray-700 pt-2 pr-4 pl-4 w-full justify-center flex">
                        <Button onClick={() => {
                            toast({
                                title: "Command copied in your clipboard.",
                                description: "Just paste it in game chat!",
                            })
                            navigator.clipboard.writeText(`/skin url ${skin.skinsource} SLIM`)
                        }}><Clipboard /></Button>
                        <Button variant="destructive" className="mr-5 ml-5" onClick={() => {
                            axios.delete(`https://lalkaxz-server.loca.lt/skins/remove/${skin.skin_id}`, {
                                headers: {
                                    'Authorization': `Bearer ${localStorage.getItem("token")}`
                                }
                            }).then(() => window.location.reload())
                        }}><Trash2 /></Button>
                        <Button onClick={() => {
                            downloadFile(skin.skinsource, "skin");
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
                    className="w-full text-center font-bold font-size pb-2 text-3xl border-b-2 border-b-gray-700">{skin.skinname}</div>
                <div className="w-full flex justify-center pb-5 pt-5">
                    <img src={`https://starlightskins.lunareclipse.studio/render/ultimate/${skin.skinsource}/full`}
                         alt="" className="w-32 h-72"/>
                </div>
                <div className="border-t-2 border-t-gray-700 pt-2 pr-4 pl-4 w-full justify-center flex">
                    <Button onClick={() => {
                        toast({
                            title: "Command copied in your clipboard.",
                            description: "Just paste it in game chat!",
                        })
                        navigator.clipboard.writeText(`/skin set ${skin.skinsource}`)
                    }}><Clipboard /></Button>
                    <Button variant="destructive" className="mr-5 ml-5" onClick={() => {
                        axios.delete(`https://lalkaxz-server.loca.lt/skins/remove/${skin.skin_id}`, {
                            headers: {
                                'Authorization': `Bearer ${localStorage.getItem("token")}`
                            }
                        }).then(() => window.location.reload())
                    }}><Trash2 /></Button>
                    <Button onClick={() => {
                        window.location.href = `https://mineskin.eu/download/${skin.skinsource}`
                    }}><Download /></Button>
                </div>
            </div>
        )
    }
}