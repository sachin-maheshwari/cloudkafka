process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

const Kafka = require("node-rdkafka");
const Config = require('config')

const kafkaConf = {
  "group.id": "cloudkarafka-group-id",
  "metadata.broker.list": Config.CLOUDKARAFKA_BROKERS.split(","),
  "socket.keepalive.enable": true,
  "security.protocol": "SASL_SSL",
  "sasl.mechanisms": "SCRAM-SHA-256",
  "sasl.username": Config.CLOUDKARAFKA_USERNAME,
  "sasl.password": Config.CLOUDKARAFKA_PASSWORD,
  "debug": Config.DEBUG
};

const topics = Config.CLOUDKARAFKA_TOPICS;
const producer = new Kafka.Producer(kafkaConf);
const maxMessages = 5;

const genMessage = i => new Buffer(`message number ${i}`);

producer.on("ready", function (arg) {
  console.log(`producer ${arg.name} ready.`);
  for (var i = 0; i < maxMessages; i++) {
    topics.forEach(function (topic) {
      producer.produce(topic, -1, genMessage(i), i);
    });
  }
  setTimeout(() => producer.disconnect(), 300);
});

producer.on("disconnected", function (arg) {
  console.log('disconnecting...');
  process.exit();
});

producer.on('event.error', function (err) {
  console.error(err);
  process.exit(1);
});
producer.on('event.log', function (log) {
  console.log(log);
});
producer.connect();
