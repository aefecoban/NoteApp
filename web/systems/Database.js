const knex = require("knex");

module.exports = class Database {

    /**
     * @type {knex}
     */
    DB;

    /**
     * 
     * @param {object} DBSettings
     */
    constructor(DBSettings) {
        this.DB = knex(DBSettings);
    }

    GetDB() {
        return this.DB;
    }

}
