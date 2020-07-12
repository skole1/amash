const mysql = require('mysql')

const connectDB = async ()=>{
    try {
        const db = await mysql.createConnection({
            'host': process.env.HOST,
            'user':process.env.USER,
            'password':process.env.PASSWORD,
            'database': process.env.DATABASE
        })
            console.log(`Mysql Connected to ${db.connect.host}`);
            
    } catch (err) {
        console.log(err)
        process.exit(1)
    }
}

module.exports = connectDB;