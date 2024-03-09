const express = require("express");
const session = require('express-session');
const cors = require("cors");
const bodyParser = require("body-parser");

const Database = require("./systems/Database");
const ModelLoader = require("./develop/database/ModelLoader");
const Plugin = require("./plugin");
const Session = require("./systems/Session");

module.exports = class Application {

    Settings;
    Port = 80;
    DB;
    Session;
    PluginSystem;

    /**
     * 
     * @param {object} Settings
     */
    constructor(Settings) {
        this.Settings = Settings;
        this.Port = Settings.Port;
        this.App = express();

        this.Session = new Session();
        this.DB = new Database(Settings.DataBaseSettings);
        this.PluginSystem = new Plugin();
    }

    #GetArgs() {
        return {
            Models : this.Models,
            DB : this.DB,
            Session : this.Session,
            Settings : this.Settings,
            App : this.App
        }
    }

    GetPluginSystem() {
        return this.PluginSystem;
    }

    async Start() {
        this.Models = ModelLoader(this.DB.GetDB());

        for (const key in this.Models) {
            await (this.Models[key]).CreateTable();
        }

        this.PluginSystem.RunHook("OnStart", this.#GetArgs());

        this.MiddleWare();
        this.Route();
    }

    MiddleWare() {

        this.App.use(session({
            secret : "SeCrEtFoR_uS",
            resave : false,
            saveUninitialized : false
        }))

        this.App.use(cors());

        this.App.use(bodyParser.urlencoded({ extended: true }));
        this.App.use(bodyParser.json());

        this.App.set("view engine", "ejs");
        
        this.PluginSystem.RunHook("OnMW", this.#GetArgs());

    }

    Route() {
      
        this.PluginSystem.RunHook("OnRoute", this.#GetArgs());
    
    }

    Listen() {
        this.PluginSystem.RunHook("BeforeListen", this.#GetArgs());
        this.App.listen(this.Port, () => {
            this.PluginSystem.RunHook("OnListen", this.#GetArgs());
        });
    }

}
