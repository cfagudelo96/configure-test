import { Test, TestingModule } from '@nestjs/testing';
import * as puppeteer from 'puppeteer';

import { ProductsService } from './products.service';
import { ProductScreenshotQuery } from './product-screenshot-query';

describe('ProductsService', () => {
  let service: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductsService]
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('takes a product screenshot', () => {
    let screenshotResult: Buffer;
    let mockedBrowser: any;
    let mockedPage: any;

    beforeEach(() => {
      screenshotResult = new Buffer('Test', 'binary');
      mockedPage = {
        goto: jest.fn(),
        waitForSelector: jest.fn(),
        screenshot: jest.fn().mockResolvedValue(screenshotResult)
      };
      mockedBrowser = { newPage: jest.fn().mockResolvedValue(mockedPage), close: jest.fn() };
      jest.spyOn(puppeteer, 'launch').mockResolvedValue(mockedBrowser);
    });

    it('should work correctly with a default configuration', async () => {
      const defaultPuppeteerConfig = { defaultViewport: { width: 1280, height: 720 } };
      const result = await service.takeProductScreenshot(new ProductScreenshotQuery());
      expect(result).toBe(screenshotResult);
      expect(puppeteer.launch).toHaveBeenCalledWith(defaultPuppeteerConfig);
      expect(mockedBrowser.close).toHaveBeenCalledTimes(1);
    });

    it('should use the product screenshot query configuration', async () => {
      const expectedPuppeteerConfig = { defaultViewport: { width: 800, height: 600 } };
      const productScreenshotQuery = new ProductScreenshotQuery();
      productScreenshotQuery.resolution = '800x600';
      const result = await service.takeProductScreenshot(productScreenshotQuery);
      expect(result).toBe(screenshotResult);
      expect(puppeteer.launch).toHaveBeenCalledWith(expectedPuppeteerConfig);
      expect(mockedBrowser.close).toHaveBeenCalledTimes(1);
    });

    it('should fail gracefully', async () => {
      mockedPage.waitForSelector.mockRejectedValue(new Error());
      try {
        await service.takeProductScreenshot(new ProductScreenshotQuery());
        fail();
      } catch (error) {
        expect(error.message).toEqual({
          error: 'Internal Server Error',
          statusCode: 500,
          message: 'An error happened while trying to take the product screenshot'
        });
        expect(mockedBrowser.close).toHaveBeenCalledTimes(1);
      }
    });
  });
});
