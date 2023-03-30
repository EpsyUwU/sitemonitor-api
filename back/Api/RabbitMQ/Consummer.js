import amqp from "amqplib";

const rabbitMQ = {
  channel: null,

  async connect() {
    const connection = await amqp.connect(
      "amqps://fmvuaato:rf8WI8vTryL7n8t0ytED8VYTQ1yHd_Mp@shark.rmq.cloudamqp.com/fmvuaato"
    );
    this.channel = await connection.createChannel();
    this.channel.assertQueue("newTyHRequest");
    this.channel.assertQueue("newTyHResponse");
    this.channel.assertQueue("AllUsersRequest");
    this.channel.assertQueue("AllUsersResponse");
    this.channel.assertQueue("AllTyHRequest");
    this.channel.assertQueue("AllTyHResponse");
    this.channel.assertQueue("ByUserRequest");
    this.channel.assertQueue("ByUserResponse");
  },
};

export default rabbitMQ;