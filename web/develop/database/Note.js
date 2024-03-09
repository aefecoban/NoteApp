const BaseModel = require("./BaseModel");

module.exports = class NoteModel extends BaseModel{

    constructor(db){
        super("Note", db);
    }

    async CreateTable() {
        this.db.schema.hasTable(this.tableName).then((exists) => {
            if (!exists) {
                return this.db.schema.createTable(this.tableName, (t) => {
                    t.increments('ID').primary();
                    t.string("Title");
                    t.text("Message");
                    t.integer('AuthorID').unsigned();
                    t.foreign("AuthorID").references("ID").inTable("User");
                    t.dateTime('CreatedAt').defaultTo(this.db.fn.now());
                    t.dateTime('UpdatedAt').defaultTo(this.db.fn.now());
                })
            }
        })
    }

}