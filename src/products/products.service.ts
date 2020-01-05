import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as puppeteer from 'puppeteer';

import { ProductScreenshotQuery } from './product-screenshot-query';

@Injectable()
export class ProductsService {
  private readonly productUrl = 'http://code.fluidretail.net/configure-ui/stable/demos/desktop/index.html';

  private readonly productConfigureSelector = '.fc-configure-display';

  async takeProductScreenshot(productScreenshotQuery: ProductScreenshotQuery): Promise<Buffer> {
    const browser = await puppeteer.launch({ defaultViewport: productScreenshotQuery.toViewport() });
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
