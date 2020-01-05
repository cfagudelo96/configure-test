import { Test, TestingModule } from '@nestjs/testing';
import * as puppeteer from 'puppeteer';

import { ProductsService } from './products.service';

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

    it('should work correctly', async () => {
      const result = await service.takeProductScreenshot();
      expect(result).toBe(screenshotResult);
      expect(mockedBrowser.close).toHaveBeenCalledTimes(1);
    });

    it('should fail gracefully', async () => {
      mockedPage.waitForSelector.mockRejectedValue(new Error());
      try {
        await service.takeProductScreenshot();
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
