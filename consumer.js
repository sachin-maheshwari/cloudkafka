var Kafka = require("node-rdkafka");
var Config = require("config");

var kafkaConf = {
  "group.id": "cloudkarafka-sachin-1",
  "metadata.broker.list": Config.CLOUDKARAFKA_BROKERS.split(","),
  "socket.keepalive.enable": true,
  "security.protocol": "SASL_SSL",
  //"sasl.mechanisms": "PLAIN",
  "sasl.mechanisms": "SCRAM-SHA-256",
  "sasl.username": Config.CLOUDKARAFKA_USERNAME,
  "sasl.password": Config.CLOUDKARAFKA_PASSWORD,
  "debug": "generic,broker,security"
};

const topics = Config.CLOUDKARAFKA_TOPICS ? Config.CLOUDKARAFKA_TOPICS : [Config.CLOUDKARAFKA_TOPIC];
const consumer = new Kafka.KafkaConsumer(kafkaConf, {
  //"auto.offset.reset": "beginning",
  'enable.auto.commit': true
});
const numMessages = 5;
var counter = 0;
consumer.on("error", function (err) {
  console.error(err);
});
consumer.on("ready", function (arg) {
  console.log(`Consumer ${arg.name} ready`);
  console.log("topic", topics)
  consumer.subscribe(topics);
  consumer.consume();
  console.log("consume", consumer)
});
consumer.on("data", function (m) {
  counter++;
  if (counter % numMessages === 0) {
    console.log("calling commit");
    consumer.commit(m);
  }
  console.log(m.value.toString());
});
consumer.on("disconnected", function (arg) {
  process.exit();
});
consumer.on('event.error', function (err) {
  console.error(err);
  process.exit(1);
});
consumer.on('event.log', function (log) {
  //console.log(log);
});
consumer.connect();

setTimeout(function () {
  consumer.disconnect();
}, 300000);
