# Apache Kafka Producer/Consumer example for (Node.js)

## Getting started

Setup your free Apache Kafka instance here: https://www.cloudkarafka.com

Configuration
set following CONSTANT values in config/dev.js and config/prod.js accordingly  
*  CLOUDKARAFKA_BROKERS="host1:9094,host2:9094,host3:9094"
  Hostnames can be found in the Details view in for your CloudKarafka instance.
* CLOUDKARAFKA_USERNAME="username"
  Username can be found in the Details view in for your CloudKarafka instance.
* CLOUDKARAFKA_PASSWORD="password"
  Password can be found in the Details view in for your CloudKarafka instance.
* CLOUDKARAFKA_TOPIC="topic"
    new topic will created if it is not present in kafka. 
* `export NODE_ENV=dev`
    SET NODE_ENV value dev|prod 
These export commands must be run in both of the terminal windows below.

```
git clone https://github.com/sachin-maheshwari/cloudkafka.git
cd cloudkafka
npm install
node producer.js
```
