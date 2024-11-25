//used to connect to database

const { MongoClient } = require('mongodb')

let dbConnection

let connectUri = 'mongodb+srv://x1164608193:wWzQsvbJwLXvyifI@cluster0.xbu0m.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'

module.exports = {
    connectToDb: (cb) => {
        MongoClient.connect(connectUri)
            .then((client) => {
                dbConnection = client.db("Storage")
                return cb()
            })
            .catch(err => {
                console.log(err)
                return cb(err)
            })
    },
    getDb: () => dbConnection
}
