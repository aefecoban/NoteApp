const Plugin = require("../../plugin")

module.exports = class UserSpec{

    /**
     * 
     * @param {Plugin} PluginSystem 
     */
    constructor(PluginSystem){
        PluginSystem.AddHook("OnStart", (args) => {
            console.log("http://localhost:" + args.Settings.Port)
        })

        PluginSystem.AddHook("OnRoute", (args) => {

            args.App.get("/", async (req, res) => {

                if(req.session.user !== undefined){
                    let ID = (args.Session.DecodeToken(req.session.user) ?? {}).ID ?? undefined;
                    if(ID == undefined){
                        res.redirect("/exit");
                        return;
                    }
                    
                    let User = await args.Models["User"].Read({ID : ID});
                    console.log(User);
                    User = (User?.data[0] ?? {});
                    res.render("home", { title: "Notes", user: User });
                    return;
                }

                res.send(`
                    <a href="/login">Login</a><br />
                    <a href="/register">Register</a>
                `);
            })

            args.App.get("/exit", (req, res) => {
                if(req.session.user !== undefined){
                    req.session.destroy();
                }

                res.redirect("/");
            })

            args.App.get("/login", (req, res) => {
                if(req.session.user !== undefined){
                    res.redirect("/");
                    return;
                }
                res.render("login", { title: "Notes - Login" });
            })

            args.App.get("/register", (req, res) => {
                if(req.session.user !== undefined){
                    res.redirect("/");
                    return;
                }
                res.render("register", { title: "Notes - Register" });
            })
            
            args.App.post("/login", (req, res) => {
                if(req.session.user !== undefined){
                    res.redirect("/");
                    return;
                }
                let username = req.body?.username;
                let password = req.body?.password;

                if(username === undefined || password === undefined){
                    res.redirect("login/?error=2");
                }

                args.Models["User"].Read({Username: username, Password: password}).then((result) => {
                    if((result?.data ?? []).length == 0){
                        res.redirect("login/?error=1");
                    }else{
                        let ID = (result?.data[0]?.ID ?? 0);
                        req.session.user = args.Session.GenerateToken({ID: ID});
                        res.redirect("/");
                    }
                })
            })

            args.App.post("/register", (req, res) => {
                if(req.session.user !== undefined){
                    res.redirect("/");
                    return;
                }
                let username = req.body?.username;
                let password = req.body?.password;
                let email = req.body?.email;
                let name = req.body?.name;
                let surname = req.body?.surname;

                if(username === undefined || password === undefined ||
                    email === undefined || name === undefined ||
                    surname === undefined){
                    res.redirect("register/?error=2");
                }

                args.Models["User"].Read({Username: username, email: email}).then(async (result) => {
                    if((result?.data ?? []).length != 0){
                        res.redirect("register/?error=1");
                    }else{
                        args.Models["User"].Create({Username: username, Password: password, Mail: email, Name: name, Surname: surname}).then(async (v) => {
                            console.log(v);
                            let ID = await args.Models["User"].Read({Username: username, Password: password});
                            ID = (ID?.data[0]?.ID ?? 0);

                            req.session.user = args.Session.GenerateToken({ID: ID});
                            if(v){
                                res.redirect("/");
                            }
                        }).catch((e) => {
                            console.log(e);
                            res.redirect("register/?error=2");
                        });
                    }
                })
            })


        })
    }

}
