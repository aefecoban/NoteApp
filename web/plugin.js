module.exports = class Plugin{

    constructor(){
        this.Hooks = {};
    }

    AddHook(HookName, Callback){
        if(this.Hooks[HookName] === undefined){
            this.Hooks[HookName] = [];
        }

        this.Hooks[HookName].push(Callback);
    }

    GetHook(HookName){
        return this.Hooks[HookName];
    }

    RunHook(HookName, ...args){
        if(this.Hooks[HookName] === undefined){
            return;
        }

        this.Hooks[HookName].forEach((v) => v(...args));
    }

}
