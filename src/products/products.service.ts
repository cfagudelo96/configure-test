import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as puppeteer from 'puppeteer';

@Injectable()
export class ProductsService {
  private readonly puppeteerBrowserConfig: puppeteer.LaunchOptions = {
    defaultViewport: {
      width: 1280,
      height: 720
    }
  };

  private readonly productUrl = 'http://code.fluidretail.net/configure-ui/stable/demos/desktop/index.html';

  private readonly productConfigureSelector = '.fc-configure-display';

  async takeProductScreenshot(): Promise<Buffer> {
    const browser = await puppeteer.launch(this.puppeteerBrowserConfig);
    try {
      const page = await browser.newPage();
      await page.goto(this.productUrl);
      await page.waitForSelector(this.productConfigureSelector);
      const buffer = await page.screenshot({ fullPage: true });
      return buffer;
    } catch (error) {
      throw new InternalServerErrorException('An error happened while trying to take the product screenshot');
    } finally {
      await browser.close();
    }
  }
}
