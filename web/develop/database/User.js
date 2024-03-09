const BaseModel = require("./BaseModel");

module.exports = class UserModel extends BaseModel{

    constructor(db){
        super("User", db);
    }

    async CreateTable() {
        this.db.schema.hasTable(this.tableName).then((exists) => {
            if (!exists) {
                return this.db.schema.createTable(this.tableName, (t) => {
                    t.increments('ID').primary();
                    t.string("Username");
                    t.string("Password");
                    t.string("Mail");
                    t.string('Name');
                    t.string('Surname');
                    //t.integer('UserLevelID').unsigned();
                    //t.foreign("UserLevelID").references("ID").inTable("UserLevel");
                })
            }
        })
    }

}