import IEmailBody from 'IEmailBody';
import nodemailer from 'nodemailer';
import logger from '../logger';

export interface IMailOptions {
  from: string;
  to: string;
  subject: string;
  html: string;
}

class EmailHelper {
  async wrapedSendMail(
    transporter: nodemailer.Transporter,
    mailOptions: IMailOptions
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          logger.error(`Failed to send email. Error message: ${error}`);
          reject(false); // or use rejcet(false) but then you will have to handle errors
        } else {
          logger.info('Email sent: ' + info.response);
          resolve(true);
        }
      });
    });
  }

  validateEmailBody(emailBody: IEmailBody) {
    const emailFormat = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    const phoneFormat =
      /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;

    if (!emailBody.email.match(emailFormat)) {
      throw new Error(`Email invalid`);
    }
    if (!emailBody.phone.match(phoneFormat)) {
      throw new Error(`Phone invalid`);
    }
    if (emailBody.name.length > 100) {
      throw new Error(`Name ${emailBody.name} invalid`);
    }
    if (!this.isURL(emailBody.website)) {
      throw new Error(`Website is not valid`);
    }
  }

  private isURL(str: string) {
    const urlRegex =
      '^(?!mailto:)(?:(?:http|https|ftp)://)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$';
    const url = new RegExp(urlRegex, 'i');
    return str.length < 2083 && url.test(str);
  }
}

export default new EmailHelper();
