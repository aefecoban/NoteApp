import { useEffect, useState } from "react";
import { UseUserContext } from "./context/UserContext";
import { Routes, Route } from 'react-router-dom';
import { BrowserDB } from "./functions/DB";
import constVals from "./constVals";
import Req from "./functions/Req";
import { UserFunctions } from "./functions/User";
import { useToast } from '@chakra-ui/react';
import Guest from "./pages/Guest";
import Home from "./pages/Home";
import Layout from "./pages/Layout";
import Profile from "./pages/Profile";
import NewNote from "./pages/NewNote";
import Note from "./pages/Note";
import EditNote from "./pages/Edit";
import DeleteNote from "./pages/Delete";
import Quit from "./pages/Quit";
import ExportNote from "./pages/ExportNote";

export default function App(){

    const UC = UseUserContext();
    let [connectionStatus, setConnectionStatus] = useState(false);

    let toast = useToast();

    function ConnectionCheck(){
        fetch(constVals.URLS.CHECK, { method : "GET", headers: { "Content-Type": "application/json" } })
        .then((v) => {
            setConnectionStatus(true);
            toast.closeAll();
        })
        .catch((e) => {
            setConnectionStatus(false);
            toast({
                title: 'Connection Error',
                description: "We cant reach the server. We can try to connect.",
                status: 'error',
                duration: 4000,
                isClosable: true,
            });
        });
    }

    useEffect(() => {
        ConnectionCheck();
        let sessionID = BrowserDB.get("user");
        UC.setter({SessionID : sessionID});
    }, []);

    useEffect(() => {
        if(!connectionStatus){
            setTimeout(() => {
                ConnectionCheck();
            }, 5000)
        }
    }, [connectionStatus]);

    useEffect(() => {
        let check1 = UC.value?.Username ?? undefined;
        let check2 = UC.value?.SessionID ?? undefined;
        if(check1 == undefined && check2 != undefined){
            Req(constVals.URLS.GETMYINFO, "POST", {}, check2).then((v) => v.json()).then((v) => {
                if(!(v?.success ?? false)){
                    UserFunctions.RemoveSession(UC);
                }else{
                    UC.setter({
                        ...UC.value,
                        ...v.data
                    });
                }
            }).catch((e) => {
                UserFunctions.RemoveSession(UC);
            })
        }
    }, [UC.value])

    return <>
        <Routes>
            <Route path="/" element={<Layout />}>
                {
                    (UC.value?.SessionID != undefined) ?
                    <>
                        <Route index element={<Home />} />
                        <Route path="profile" element={<Profile />} />
                        <Route path="newnote" element={<NewNote />} />
                        <Route path="note/:id" element={<Note />} />
                        <Route path="edit/:id" element={<EditNote />} />
                        <Route path="delete/:id" element={<DeleteNote />} />
                        <Route path="quit" element={<Quit />} />
                    </>
                    :
                    <>
                        <Route index element={<Guest />} />
                        <Route path="*" element={<Guest />} />
                    </>
                }
            </Route>
            {
                (UC.value?.SessionID != undefined) ?
                <Route path="export/:id" element={<ExportNote />} />
                :
                <Route path="*" element={<Guest />} />
            }
        </Routes>
    </>

}