import { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import Req from "../functions/Req";
import constVals from "../constVals";
import { UseUserContext } from "../context/UserContext";

export default function ExportNote(){
    
    let params = useParams();
    let ID = params.id;
    let UC = UseUserContext();
    let [note, setNote] = useState({});

    useEffect(() => {
        let noteID = params.id;

        Req(constVals.URLS.NOTE, "POST", { ID: noteID }, UC.value.SessionID).then((v) => v.json()).then((res) => {
            if (res.success) {
                setNote(res.data);
            }
        });

    }, []);

    return <>
        #{note.Title}
        {note.Message}
        {JSON.stringify(note)}
    </>

}