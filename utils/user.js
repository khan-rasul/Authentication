var crypto = require("crypto");
class User{
    constructor(user)
    {
        this.username = user.username;
        this.salt = user.salt;
        this.hash = user.hash;
    }
    setPassword(password){
        this.salt = crypto.randomBytes(64).toString("hex");
        this.hash = crypto.pbkdf2Sync(password , this.salt , 100000 , 64 , "sha512").toString("hex");
    }
    validatePassword(password){
        const hash = crypto.pbkdf2Sync(password, this.salt, 100000, 64, "sha512").toString("hex");
        return this.hash === hash;
    }
}
module.exports = User;