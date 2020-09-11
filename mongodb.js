
const {MongoClient, ObjectID } = require('mongodb')

const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'

MongoClient.connect(connectionURL, { useNewUrlParser: true } , (error, client) => {
    if (error){
        return console.log('unable to connect to database')
    }

    const db = client.db(databaseName)

    // db.collection('users').findOne({ name : 'jen'} , (error, user) => {
    //     if(error){
    //         return console.log('unable to fetch')
    //     }
    //     console.log(user)
    // })

    // db.collection('tasks').findOne({_id : new ObjectID('5f3ac5affb03300c24d403be')} , (error, task)=>{
    //     console.log(task)
    // })
    // db.collection('tasks').find({complete : false}).count((error,task) => {
    //     console.log(task)
    // })

    // db.collection('tasks').updateMany({},{
    //     $set :{
    //         complete : true
    //     }
    // }).then((result) =>{
    //     console.log(result)
    // }).catch((error)=>{
    //     console.log(error)
    // })
    db.collection('tasks').deleteOne({complete : false}).then((result)=>{
        console.log(result)
    }).catch((error)=>{
        console.log(error)
    })
})
