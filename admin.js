process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

const Kafka = require("node-rdkafka");
const Config = require('config')

const kafkaConf = {
  "client.id": "cloudkarafka-client-id",
  "metadata.broker.list": Config.CLOUDKARAFKA_BROKERS.split(","),
  "socket.keepalive.enable": true,
  "security.protocol": "SASL_SSL",
  "sasl.mechanisms": "SCRAM-SHA-256",
  "sasl.username": Config.CLOUDKARAFKA_USERNAME,
  "sasl.password": Config.CLOUDKARAFKA_PASSWORD,
  "debug": Config.DEBUG
};


const p = new Kafka.Producer(kafkaConf);
p.on('ready', function (arg) {
  p.getMetadata({}, (err, data) => {
    if (data) {
      let current_topics = [];
      data.topics.forEach((o) => {
        console.log(o.name);
        current_topics.push(o.name);
        //console.log(o.partitions)
      })
      console.log('backup of current topics:', current_topics.join("','"));
      p.disconnect()
    }
  })
});
p.connect();

const create_topics = Config.TOPIC.CREATE_LIST; // list of topic to be created 
const delete_topics = Config.TOPIC.DELETE_LIST; // list of topic to be deleted 

const client = Kafka.AdminClient.create(kafkaConf);

create_topics.forEach((topic) => {
  client.createTopic({
    topic,
    num_partitions: Config.TOPIC.PARTITIONS,
    replication_factor: Config.TOPIC.REPLICATION
  }, function (err) {
    if (err) {
      console.log(`Error occured while creating topic ${topic} :`, err)
    }
  })
});

delete_topics.forEach((topic) => {
  client.deleteTopic(topic, function (err) {
    if (err) {
      console.log(`Error occured while deleting topic ${topic} :`, err)
    }
  })
});

client.disconnect()
