const db = require ('./conn.js');

class restaurants {

    static async getAll() {
        try {
            const response = await db.any(`select * from restaurants;`);
            return response;
        } catch(err) {
            return err.message
        }
    }

    static async getOne(restaurantId) {
        try {
            const response = await db.any(`select * from restaurants where id = ${restaurantId};`);
            return response;
        } catch(err) {
            return err.message
        }
    }

    static async addReview(restaurantId, userID, content, score) {
        const query = `insert into reviews(score, content, restaurant_id, user_id) values (${score}, '${content}', ${restaurantId}, ${userID});`;
        try {
            let response = await db.result(query);
            return response;
        } catch(err) {
            console.log("ERROR", err.message);
            return err
        }
    }

    static async getRestaurantReviews(restaurantId) {
        let query = `select * from restaurants as res join reviews as rev on res.id = rev.restaurant_id where res.id = ${restaurantId};`;
        try {
            let response = await db.result(query);
            return response;
        } catch(err) {
            console.log("ERROR", err.message);
            return err
        }
    }
}

module.exports = restaurants;
