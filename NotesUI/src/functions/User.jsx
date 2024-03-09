import constVals from "../constVals";
import { BrowserDB } from "./DB";
import Req from "./Req"

function Quit(UC){
    if( ((UC?.value ?? {})?.SessionID ?? undefined) != undefined ){
        Req(constVals.URLS.QUIT, "POST", {}, UC.value.SessionID);
    }
    RemoveSession(UC);
}

function RemoveSession(UC){
    UC.setter({});
    BrowserDB.del("user");
}

export const UserFunctions = {
    Quit : Quit,
    RemoveSession : RemoveSession
}