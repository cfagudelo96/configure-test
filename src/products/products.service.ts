import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as puppeteer from 'puppeteer';

import { ProductScreenshotQuery } from './product-screenshot-query';

@Injectable()
export class ProductsService {
  static readonly VALID_SCREENSHOT_RESOLUTIONS = ['800x600', '1280x720', '1600x900', '1920x1080'];

  private readonly SCREENSHOT_TTL = 5 * 60 * 1000; // 5 minutes

  private readonly productUrl = 'http://code.fluidretail.net/configure-ui/stable/demos/desktop/index.html';

  private readonly productConfigureSelector = '.fc-configure-display';

  private screenshotCache: { [resolution: string]: Buffer };

  constructor() {
    this.screenshotCache = ProductsService.VALID_SCREENSHOT_RESOLUTIONS.reduce(
      (screenshotCache, resolution) => ({ ...screenshotCache, [resolution]: undefined }),
      {}
    );
  }

  async getProductScreenshot(productScreenshotQuery: ProductScreenshotQuery): Promise<Buffer> {
    const cachedScreenshot = this.screenshotCache[productScreenshotQuery.resolution];

    return cachedScreenshot ? cachedScreenshot : this.takeProductScreenshot(productScreenshotQuery);
  }

  private async takeProductScreenshot(productScreenshotQuery: ProductScreenshotQuery): Promise<Buffer> {
    const browser = await puppeteer.launch({ defaultViewport: productScreenshotQuery.toViewport() });
    try {
      const page = await browser.newPage();
      await page.goto(this.productUrl);
      await page.waitForSelector(this.productConfigureSelector);
      const screenshot = await page.screenshot({ fullPage: true });
      this.saveScreenshotInCache(productScreenshotQuery.resolution, screenshot);
      return screenshot;
    } catch (error) {
      throw new InternalServerErrorException('An error happened while trying to take the product screenshot');
    } finally {
      await browser.close();
    }
  }

  private saveScreenshotInCache(resolution: string, screenshot: Buffer) {
    this.screenshotCache[resolution] = screenshot;
    setTimeout(() => {
      this.screenshotCache[resolution] = undefined;
    }, this.SCREENSHOT_TTL);
  }
}
