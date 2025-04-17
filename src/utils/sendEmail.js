// const { SendEmailCommand } = require("@aws-sdk/client-ses");
// const { sesClient } = require("./sesClient.js");

// const createSendEmailCommand = (toAddress, fromAddress, subject, body) => {
//   return new SendEmailCommand({
//     Destination: {
//       CcAddresses: [],
//       ToAddresses: [toAddress],
//     },
//     Message: {
//       Body: {
//         Html: {
//           Charset: "UTF-8", 
//           Data: `<h1>${body}</h1>`,
//         },
//         Text: {
//           Charset: "UTF-8",
//           Data: "This is the text format for email",
//         },
//       },
//       Subject: {
//         Charset: "UTF-8",
//         Data: subject,
//       },
//     },
//     Source: fromAddress,
//     ReplyToAddresses: [
//       /* more items */
//     ],
//   });
// };

// const run = async (toAddress,subject, body) => {
//   const sendEmailCommand = createSendEmailCommand(
//     toAddress,
//     // "msourav.4411@gmail.com",
//     "sourav@devin.monster",
//     subject,
//     body
//   );

//   try {
//     return await sesClient.send(sendEmailCommand);
//   } catch (caught) {
//     if (caught instanceof Error && caught.name === "MessageRejected") {
//       const messageRejectedError = caught;
//       return messageRejectedError;
//     }
//     throw caught;
//   }
// };

// // snippet-end:[ses.JavaScript.email.sendEmailV3]
// module.exports = { run };




const { SendEmailCommand } = require("@aws-sdk/client-ses");
const { sesClient } = require("./sesClient.js");

const createSendEmailCommand = (toAddress, fromAddress, subject, body) => {
  const htmlBody = `
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f9f9f9;
          }
          .container {
            max-width: 600px;
            margin: auto;
            background: #ffffff;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          }
          h2 {
            color: #333333;
          }
          p {
            font-size: 16px;
            color: #555555;
            line-height: 1.5;
          }
          .footer {
            margin-top: 30px;
            font-size: 14px;
            color: #888888;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>${subject}</h2>
          <p>${body}</p>
          <div class="footer">
            <p>You received this email because someone showed interest in connecting with you.</p>
            <p>If you were not expecting this, you can ignore this email.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return new SendEmailCommand({
    Destination: {
      CcAddresses: [],
      ToAddresses: [toAddress],
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: htmlBody,
        },
        Text: {
          Charset: "UTF-8",
          Data: body,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: subject,
      },
    },
    Source: fromAddress,
    ReplyToAddresses: [],
  });
};

const run = async (toAddress, subject, body) => {
  const sendEmailCommand = createSendEmailCommand(
    toAddress,
    "sourav@devin.monster", // Sender email
    subject,
    body
  );

  try {
    return await sesClient.send(sendEmailCommand);
  } catch (caught) {
    if (caught instanceof Error && caught.name === "MessageRejected") {
      return caught; // Return the error if message was rejected
    }
    throw caught; // Throw other errors
  }
};

module.exports = { run };

