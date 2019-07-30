module.exports = {
    CLOUDKARAFKA_TOPICS: ["topic1"],
    DEBUG : 'generic', // can use "generic,broker,security"
    TOPIC : { 
        CREATE_LIST : [], // array of new topics name
        PARTITIONS : 1,
        REPLICATION :1,
        DELETE_LIST : [], // array of topics name 
    }
}
