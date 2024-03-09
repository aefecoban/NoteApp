import { useNavigate } from "react-router-dom";
import { UseUserContext } from "../context/UserContext";
import { UserFunctions } from "../functions/User";
import { useEffect } from "react";

export default function Quit(){
    let nav = useNavigate();
    let UC = UseUserContext();
    useEffect(() => {
        UserFunctions.Quit(UC);
        nav("/");
    }, [])
    return <>
    </>
}