import _ from 'lodash';
import config from 'config';
import { Route, Controller, Get, Post, Middlewares } from 'tsoa';

import IGenericFailureResponse from '../types/IGenericFailureResponse';
import landingPageData from '../json/data.json';

import nodemailer from 'nodemailer';
import { NextFunction, Request } from 'express';
import INodeMailerConfig from 'INodemailerConfig';
@Route('landing-page')
@Middlewares([
  (req: Request, res: Response, next: NextFunction) => {
    console.log(req.socket.remoteAddress);
    next();
  },
])
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
      console.error(
        `Error while getting landing page data; with message ${err.message}`
      );

      this.setStatus(500);
      return { success: false, message: err.message };
    }
  }

  @Post('email')
  public async sendEmail(): Promise<any> {
    try {
      const nodemailerConfig: INodeMailerConfig = config.get('nodemailer');
      const fromEmail: string = config.get('fromEmail');
      const toEmail: string = config.get('toEmail');

      const transport = nodemailer.createTransport(nodemailerConfig);
      const mailOptions = {
        from: fromEmail,
        to: toEmail,
        subject: 'Test', // Subject line
        html: '<p>test</p>', // plain text body
      };

      transport.sendMail(mailOptions, function (err, info) {
        if (err) {
          throw err;
        }
        return {
          success: true,
        };
      });
    } catch (error) {
      return {
        success: false,
      };
    }
  }
}
