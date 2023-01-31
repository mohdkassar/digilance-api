import { Route, Controller, Get, Post, Body } from 'tsoa';
import nodemailer from 'nodemailer';
import config from 'config';

import EmailHelper from '../helpers/EmailHelper';

import landingPageData from '../json/data.json';
import { html } from '../json/email.html';

import IGenericFailureResponse from '../types/IGenericFailureResponse';
import INodeMailerConfig from '../types/INodemailerConfig';
import IEmailBody from '../types/IEmailBody';
import _ from 'lodash';
import logger from '../logger';

@Route('landing-page')
// @Middlewares([
//   (req: Request, res: Response, next: NextFunction) => {
//     next();
//   },
// ])
export class LandingPageController extends Controller {
  @Get('data')
  public async getLandingPageData(): Promise<any | IGenericFailureResponse> {
    try {
      if (_.isEmpty(landingPageData)) {
        this.setStatus(404);
        return {
          success: false,
          message: `No data found`,
        };
      }

      this.setStatus(200);
      return landingPageData;
    } catch (err) {
      logger.error(
        `Error while getting landing page data; with message ${err.message}`
      );

      this.setStatus(500);
      return { success: false, message: err.message };
    }
  }

  @Post('email')
  public async sendEmail(@Body() emailBody: IEmailBody): Promise<any> {
    try {
      const nodemailerConfig: INodeMailerConfig = config.get('nodemailer');
      const fromEmail: string = config.get('fromEmail');
      const toEmail: string = config.get('toEmail');
      const userEmail = emailBody.email;

      const transport = nodemailer.createTransport(nodemailerConfig);

      EmailHelper.validateEmailBody(emailBody);

      await EmailHelper.wrapedSendMail(transport, {
        from: fromEmail,
        to: toEmail,
        subject: 'Digilance Inquiry',
        html: `
        <p>${emailBody.name} is inquiring about ${emailBody.consult}.</p>
        <br>
        <p>Their contact details are: ${emailBody.email}, ${emailBody.phone}, ${emailBody.website}.</p>
        <br>
        <p>Their comment was: ${emailBody.comment}</p>
        `,
      });

      await EmailHelper.wrapedSendMail(transport, {
        from: fromEmail,
        to: userEmail,
        subject: 'Digilance Inquiry',
        html,
      });
    } catch (error) {
      logger.error(error);
      return {
        success: false,
      };
    }
  }
}
