const {Kafka} = require('kafkajs')

const client = new Kafka({
    brokers: ['localhost:29092',],
    clientId: 'my-app',
})

module.exports = client