const Plugin = require("../../plugin")
const crypto = require("crypto");

module.exports = class API{

    /**
     * 
     * @param {Plugin} PluginSystem 
     */
    constructor(PluginSystem){

        PluginSystem.AddHook("OnMW", (args) => {
            args.App.use((req, res, next) => this.APImw(req, res, args, next))
        })

        PluginSystem.AddHook("OnRoute", (args) => {
            args.App.post("/api/login", async (req, res) => this.Login(req, res, args))
            args.App.post("/api/register", async (req, res) => this.Register(req, res, args))
            args.App.post("/api/getMyInfo", async (req, res) => this.GetMyInfo(req, res, args))
            args.App.post("/api/newnote", async (req, res) => this.NewNote(req, res, args))
            args.App.post("/api/mynotes", async (req, res) => this.GetMyNotes(req, res, args))
            args.App.post("/api/note", async (req, res) => this.GetNote(req, res, args))
            args.App.post("/api/quit", async (req, res) => this.Quit(req, res, args))
            args.App.post("/api/updatenote", async (req, res) => this.UpdateNote(req, res, args))
            args.App.post("/api/deletenote", async (req, res) => this.DeleteNote(req, res, args))
            args.App.get("/api/check", async (req, res) => { res.json({success : true}) })
        })

    }

    CreateKey(value){
        return crypto.createHash('sha256').update(value).digest('hex');
    }

    APImw(req, res, args, next){
        if(req.url.startsWith("/api")){
            let Auth = (req.headers?.authorization ?? undefined);
            let UserID = undefined;
            if(Auth != undefined){
                Auth = Auth.replace("Bearer ", "");
                UserID = args.Session.GetSession(Auth);
                if(UserID != undefined){
                    UserID = args.Session.DecodeToken(UserID);
                    UserID = UserID?.ID ?? undefined;
                }
            }
            req.UserID = UserID;
        }

        next();
    }

    async Quit(req, res, args){
        if(req.UserID == undefined){
            return res.json({
                success : false,
                error : "Not logged in"
            })
        }

        let Auth = (req.headers?.authorization ?? undefined);
        if(Auth != undefined){
            Auth = Auth.replace("Bearer ", "");
            args.Session.RemoveSession(Auth);
        }
        return res.json({
            success : true
        });
    }

    async NewNote(req, res, args) {
        if(req.UserID == undefined){
            return res.json({
                success : false,
                error : "Not logged in"
            })
        }

        let {title, text} = req.body;

        if(title == undefined || text == undefined){
            return res.json({
                success : false,
                error : "Missing infos"
            });
        }

        let Note = await args.Models["Note"].Create({
            Title : title,
            Message : text,
            AuthorID : req.UserID
        })

        if(Note.success){
            return res.json({
                success : true
            })
        }

    }

    async Register(req, res, args){
        let { username, password, mail, name, surname } = req.body;
        if(username == undefined || password == undefined || mail == undefined || name == undefined || surname == undefined){
            return res.json({
                success : false,
                error : "Missing infos"
            });
        }

        let User1 = await args.Models["User"].Read({Username : username});
        let User2 = await args.Models["User"].Read({Mail : mail});
        if(
            (User1?.data ?? []).length == 0
            &&
            (User2?.data ?? []).length == 0
        ){
            let User = await args.Models["User"].Create({
                Username : username,
                Password : password,
                Mail : mail,
                Name : name,
                Surname : surname
            });
            if(User.success){
                return res.json({
                    success : true
                })
            }else{
                return res.json({
                    success : false
                })
            }
        }

    }

    async Login(req, res, args){
        let { username, password } = req.body;
        console.log(req.body);
        if(username == undefined || password == undefined){
            return res.json({
                success : false,
                error : "Missing username or password"
            });
        }

        let User = await args.Models["User"].Read({Username : username, Password : password});
        if(User.success && (User?.data ?? []).length > 0){
            let Value = User.data[0];
            Value = JSON.stringify({ID : Value.ID});
            Value = args.Session.GenerateToken(Value);
            let Key = this.CreateKey(Value);
            args.Session.AddSession(Key, Value);
            return res.json({
                success : true,
                data : {
                    SessionID : Key
                }
            });
        }

        return res.json({
            success : false,
            error : "Wrong username or password"
        })
    }

    async GetMyInfo(req, res, args){
        if(req.UserID == undefined){
            return res.json({
                success : false,
                error : "Not logged in"
            })
        }

        let User = await args.Models["User"].Read({ID : req.UserID});
        if(User.success && (User?.data ?? []).length > 0){
            return res.json({
                success : true,
                data : User.data[0]
            })
        }
    }

    async GetNote(req, res, args){
        if(req.UserID == undefined){
            return res.json({
                success : false,
                error : "Not logged in"
            })
        }

        let Note = await args.Models["Note"].Read({ID : req.body?.ID ?? -1});
        if(Note.success && (Note?.data ?? []).length > 0){
            
            Note.data[0]["Sum"] = Note.data[0].Message?.slice(0, 75);
            return res.json({
                success : true,
                data : Note.data[0]
            })
        }

        return res.json({
            success : true,
            data : {}
        })

    }

    async GetMyNotes(req, res, args){
        if(req.UserID == undefined){
            return res.json({
                success : false,
                error : "Not logged in"
            })
        }

        let Notes = await args.Models["Note"].Read({AuthorID : req.UserID});
        if(Notes.success && (Notes?.data ?? []).length > 0){
            let N = Notes.data;
            for(let i = 0; i < N.length; i++){
                N[i]["Sum"] = N[i].Message?.slice(0, 75);
            }
            return res.json({
                success : true,
                data : Notes.data
            })
        }

        return res.json({
            success : false
        })

    }

    async UpdateNote(req, res, args){
        if(req.UserID == undefined){
            return res.json({
                success : false,
                error : "Not logged in"
            })
        }

        let {ID, Title, Message} = req.body;
        ID =  req.body?.ID ?? -1;

        let Note = await args.Models["Note"].Read({ID : ID, AuthorID : req.UserID});
        console.log(Note);
        if(Note.success && (Note?.data ?? []).length > 0){
            let Update = await args.Models["Note"].Update({ID : ID}, {
                Title : Title,
                Message : Message
            });

            return res.json(Update);
        }

        return res.json({
            success : false
        })
    }

    async DeleteNote(req, res, args){
        if(req.UserID == undefined){
            return res.json({
                success : false,
                error : "Not logged in"
            })
        }

        let {ID} = req.body;
        ID =  req.body?.ID ?? -1;

        let Note = await args.Models["Note"].Delete({ID : ID, AuthorID : req.UserID});
        return res.json(Note)
    }

}
