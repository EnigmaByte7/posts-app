// const client = require('./kafka')
// const admin = client.admin();

// async function init(){
//     await admin.connect();
//     console.log('Admin connected successfully...');
    
//     //create topics
//     await admin.createTopics({
//         topics:[
//             {
//                 topic:'test',
//                 numPartitions: 2,
//             }
//         ]
//     })

//     await admin.disconnect()
// }

// module.exports = init()