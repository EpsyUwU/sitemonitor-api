import AWS from 'aws-sdk'

const sns = new AWS.SNS({
  accessKeyId: "AKIAXCNTY3ZVRSH7LDOU",
  secretAccessKey: "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",
  region: "us-east-2"
});

export default sns;