const NoteModel = require("./Note");
const UserModel = require("./User");
const UserLevelModel = require("./UserLevel");

module.exports = (DB) => {
    return {
        UserLevel : new UserLevelModel(DB),
        User : new UserModel(DB),
        Note : new NoteModel(DB),
    };
}
