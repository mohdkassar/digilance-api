import _ from "lodash";

import { Route, Controller, Get } from "tsoa";

import IGenericFailureResponse from "../types/IGenericFailureResponse";
import landingPageData from "../json/data.json";

@Route("landing-page")
export class LandingPageController extends Controller {
  @Get("data")
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
}
