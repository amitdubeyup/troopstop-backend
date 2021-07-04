const nodemailer = require('nodemailer');

module.exports = {
  sendMail: sendMail,
  sendCustomMail: sendCustomMail,
}

function sendMail(req, res) {
  nodemailer.createTestAccount((err, account) => {
    const transporter = nodemailer.createTransport({
      port: 465,
      host: 'smtp.gmail.com',
      secure: true,
      pool: true,
      auth: {
        user: 'amitdubeynodemailer@gmail.com',
        pass: 'Gmail@2020'
      },
    });
    const mailOptions = {
      from: `TroopStop <amitdubeynodemailer@gmail.com>`,
      to: req.body.to,
      subject: req.body.subject,
      html: req.body.html
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        res.status(400);
        return res.json({
          success: false,
          message: 'Unable to send email!',
          data: error
        });
      } else {
        res.status(200);
        return res.json({
          success: true,
          message: 'Mail sent successfully!',
          data: info
        });
      }
    });
  });
}

function sendCustomMail(mailData) {
  return new Promise((resolve, reject) => {
    nodemailer.createTestAccount((err, account) => {
      const transporter = nodemailer.createTransport({
        port: 465,
        host: 'smtp.gmail.com',
        secure: true,
        pool: true,
        auth: {
          user: 'amitdubeynodemailer@gmail.com',
          pass: 'Gmail@2020'
        },
      });
      const mailOptions = {
        from: `TroopStop <amitdubeynodemailer@gmail.com>`,
        to: req.body.to,
        subject: req.body.subject,
        html: req.body.html
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          resolve({
            success: false,
            message: 'Unable to send email!',
            data: error
          });
        } else {
          resolve({
            success: true,
            message: 'Mail sent successfully!',
            data: info
          });
        }
      });
    });
  });
}