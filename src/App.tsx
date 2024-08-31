import RegisterPage from "@/components/pages/RegisterPage.tsx";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import LoginPage from "@/components/pages/LoginPage.tsx"
import Landing from "@/components/pages/Landing"
import {useEffect, useState} from "react";
import axios from "axios";
import LoadingSkeleton from "@/LoadingSkeleton.tsx";

function App() {
    const [loading, setLoading] = useState(false)
    const [valid, setValid] = useState(false)

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setLoading(true);
            axios.get("https://lalkaxz-server.loca.lt/user/token", {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    "Access-Control-Allow-Origin": "*"
                }
            }).then((res) => {
                if (res.status === 200) {
                    setValid(true);
                }
                setLoading(false);
            }).catch((err) => {
                if (err.response && err.response.status === 404) {
                    setValid(false);
                    localStorage.removeItem("token");
                }
                setLoading(false);
            });
        }
    }, []);

    if (loading) {
        return <LoadingSkeleton />;
    }

    if (!localStorage.getItem("token") || !valid) {
        return (
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                </Routes>
            </BrowserRouter>
        );
    }

    return <Landing />;

}

export default App
