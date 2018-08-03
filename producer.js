const Kafka = require("node-rdkafka");
const Config = require('config')

const kafkaConf = {
  "group.id": "cloudkarafka-sachin",
  "metadata.broker.list": Config.CLOUDKARAFKA_BROKERS.split(","),
  "socket.keepalive.enable": true,
  "security.protocol": "SASL_SSL",
  "sasl.mechanisms": "SCRAM-SHA-256",
  "sasl.username": Config.CLOUDKARAFKA_USERNAME,
  "sasl.password": Config.CLOUDKARAFKA_PASSWORD,
  "debug": "generic,broker,security"
};

const topic = Config.CLOUDKARAFKA_TOPIC;
const producer = new Kafka.Producer(kafkaConf);
const maxMessages = 20;

const genMessage = i => new Buffer(`Kafka example, message number ${i}`);

producer.on("ready", function(arg) {
  console.log(`producer ${arg.name} ready.`);
  for (var i = 0; i < maxMessages; i++) {
    producer.produce(topic, -1, genMessage(i), i);
  }
  setTimeout(() => producer.disconnect(), 30);
});

producer.on("disconnected", function(arg) {
  process.exit();
});

producer.on('event.error', function(err) {
  console.error(err);
  process.exit(1);
});
producer.on('event.log', function(log) {
  console.log(log);
});
producer.connect();
