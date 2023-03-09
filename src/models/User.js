/**
 * User model
 */
class User {
    constructor(data = {}) {
        this.id = null;
        this.username = null;
        this.password = null;
        this.status = null;
        this.createDay = null;
        this.birthDay = null;
        Object.assign(this, data);
    }
}

export default User;
