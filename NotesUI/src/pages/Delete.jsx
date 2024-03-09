import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { UseUserContext } from "../context/UserContext";
import Req from "../functions/Req";
import constVals from "../constVals";

export default function DeleteNote(){

    let nav = useNavigate();
    let param = useParams();
    let UC = UseUserContext();

    useEffect(() => {
        let noteID = param.id;
        Req(constVals.URLS.DELETENOTE, "POST", {ID : noteID}, UC.value.SessionID).finally(() => {
            nav("/");
        })
    }, [])

    return <></>

}