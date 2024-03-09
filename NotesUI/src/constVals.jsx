const serverURL = "http://localhost/";
const apiURL = "http://localhost/api/";

export default {
    SERVER_URL : serverURL,
    URLS : {
        CHECK : apiURL + "check",
        LOGIN : apiURL + "login",
        REGISTER : apiURL + "register",
        GETMYINFO : apiURL + "getMyInfo",
        NEWNOTE : apiURL + "newnote",
        MYNOTES : apiURL + "mynotes",
        NOTE : apiURL + "note",
        UDPATENOTE : apiURL + "updatenote",
        DELETENOTE : apiURL + "deletenote",
        QUIT : apiURL + "quit"
    }
}