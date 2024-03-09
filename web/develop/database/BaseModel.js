const knex = require('knex');

class BaseModel {

    /**
     * 
     * @param {string} tableName
     * @param {knex} db
     */
    constructor(tableName, db) {
        this.tableName = tableName;
        this.db = db;
    }

    async Create(data) {
        try {
            await this.db(this.tableName).insert(data);
            return { success: true };
        } catch (error) {
            return { success: false, error: error };
        }
    }

    async CreateTable() { }

    async Read(query) {
        try {
            if (typeof query === 'string') {
                const result = await this.db.raw(query);
                return { success: true, data: result };
            } else if (typeof query === 'object') {
                const result = await this.db(this.tableName).where(query);
                return { success: true, data: result };
            } else {
                return { success: false, data: null };
            }
        } catch (error) {
            return { success: false, error: error };
        }
    }

    async ReadAll() {
        try {
            const result = await this.db(this.tableName);
            return { success: true, data: result };
        } catch (error) {
            return { success: false, error: error };
        }
    }

    async Update(where, data) {
        try {
            await this.db(this.tableName).where(where).update(data);
            return { success: true };
        } catch (error) {
            return { success: false, error: error };
        }
    }

    async Delete(where) {
        try {
            await this.db(this.tableName).where(where).del();
            return { success: true };
        } catch (error) {
            return { success: false, error : error };
        }
    }
}

module.exports = BaseModel;
