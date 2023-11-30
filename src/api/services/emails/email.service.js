const Email = require("email-templates");
const nodemailer = require("nodemailer");
const { emailConfig, env } = require("../../../config/config");
const logger = require("../../../config/logger");

// SMTP is the main transport in Nodemailer for delivering messages.
// SMTP is also the protocol used between almost all email hosts, so its truly universal.
// if you dont want to use SMTP you can create your own transport here
// such as an email service API or nodemailer-sendgrid-transport
// console.log("about email");
// console.log(emailConfig.smtp.port);
// console.log(emailConfig.smtp.host);
const transporter = nodemailer.createTransport({
  port: emailConfig.smtp.port,
  host: emailConfig.smtp.host,
  name: "www.yigegnal.com",
  // service: "gmail",
  auth: {
    user: "admin101@yigegnal.com",
    pass: "Testasdfasdf101",
    
    // user: emailConfig.auth.username,
    // pass: emailConfig.auth.password,
  },
  secure: true, // upgrades later with STARTTLS -- change this based on the PORT
});

// const transporter = nodemailer.createTransport(emailConfig.smtp);

// verify connection configuration
// transporter.verify((error) => {
//   if (error) {
//     console.log('error with email connection');
//   }
// });

if (env !== "test") {
  transporter
    .verify()
    .then(() => logger.info("connected to email server"))
    .catch(() => logger.warn("unable to connect to email server"));
}

exports.sendResetPasswordEmail = async (userEmail, token) => {
  const email = new Email({
    views: { root: __dirname },
    message: {
      from: "admin101@yigegnal.com",
    },
    // uncomment below to send emails in development/test env:
    send: true,
    transport: transporter,
  });

  email
    .send({
      template: "passwordReset",
      message: {
        to: userEmail,
      },
      locals: {
        productName: "Yigenal",
        // passwordResetUrl should be a URL to your app that displays a view where they
        // can enter a new password along with passing the resetToken in the params
        passwordResetUrl: `http://192.168.8.139:4200/#/reset-password?resetToken=${token}`,
      },
    }).then(()=> console.log('passwordResetUrl is: '+ token))
    .catch((err) => console.log("error sending password reset email"+ err));
};

exports.sendPasswordChangeEmail = async (user) => {
  const email = new Email({
    views: { root: __dirname },
    message: {
      from: "saminassaminas@gmail.com",
    },
    // uncomment below to send emails in development/test env:
    send: true,
    transport: transporter,
  });

  email
    .send({
      template: "passwordChange",
      message: {
        to: user.email,
      },

      locals: {
        productName: "Test App",
        name: user.name,
      },
    })
    .catch(() => console.log("error sending change password email"));
};

exports.sendVerificationEmail = async (user, link) => {
  console.log('verifying');
  
  console.log(user.email);
  const email = new Email({
    views: { root: __dirname },
    message: {
      from: "admin101@yigegnal.com",
    },
    // uncomment below to send emails in development/test env:
    send: true,
    transport: transporter,
  });

  email
    .send({
      template: "emailVerification",
      message: {
        to: user.email,
      },
      locals: {
        productName: "Yigegnal PLC",
        name: user.firstName,
        link: `192.168.8.139:3000/v1/auth/verify-email?token=${link}`,
      },
    }).then(()=> console.log('here is the link=>.'+ link))
    .catch((error) => console.log("error sending account verification email: " + error));
};
