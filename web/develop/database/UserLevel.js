const BaseModel = require("./BaseModel");

module.exports = class UserLevelModel extends BaseModel{

    constructor(db){
        super("UserLevel", db);
    }

    async CreateTable() {
        this.db.schema.hasTable(this.tableName).then((exists) => {
            if (!exists) {
                return this.db.schema.createTable(this.tableName, (t) => {
                    t.increments('ID').primary();
                    t.bool("levelName");
                    t.bool("AccessAdminPanel");
                    t.bool("WriteNote");
                })
            }
        })
    }

}