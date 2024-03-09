const app = require("./app");

const path = require("path");
const UserSpec = require("./develop/userSpec/userSpec");
const API = require("./develop/api/api");

async function Main() {
    const App = new app({
        Port: 80,
        DataBaseSettings: {
            client: "sqlite3",
            useNullAsDefault: true,
            connection: {
                filename: path.join(__dirname, "database.sqlite")
            }
        }
    });

    let PS = App.GetPluginSystem();
    let P1 = new UserSpec(PS);
    let P2 = new API(PS);

    await App.Start();

    App.Listen();
}

Main();
