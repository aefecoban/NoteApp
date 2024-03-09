const jwt = require('jsonwebtoken');

module.exports = class Session{

    Sessions = {};

    constructor(){
        this.Sessions = {};
    }

    AddSession(key, value) {
        this.Sessions[key] = value;
    }

    GetSession(key) {
        return this.Sessions[key] ?? undefined;
    }

    RemoveSession(key) {
        delete this.Sessions[key];
    }

    GenerateToken(data){
        return jwt.sign(data, "JwT_SeCrEt_FoR_Us");
    }

    DecodeToken(token){
        return jwt.verify(token, "JwT_SeCrEt_FoR_Us");
    }

}