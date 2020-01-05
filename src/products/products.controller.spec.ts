import { Test, TestingModule } from '@nestjs/testing';
import * as mocks from 'node-mocks-http';

import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { ProductScreenshotQuery } from './product-screenshot-query';

describe('Products Controller', () => {
  let productsController: ProductsController;
  let productsService: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [ProductsService]
    }).compile();

    productsController = module.get<ProductsController>(ProductsController);
    productsService = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(productsController).toBeDefined();
  });

  describe('takes a product screenshot', () => {
    let expectedResult: Buffer;
    let mockedResponse: mocks.MockResponse<any>;

    beforeEach(() => {
      expectedResult = new Buffer('Test');
      jest.spyOn(productsService, 'takeProductScreenshot').mockResolvedValue(expectedResult);
      mockedResponse = mocks.createResponse();
    });

    it('should get the screenshot of a product', async () => {
      await productsController.takeProductScreenshot(new ProductScreenshotQuery(), mockedResponse);
      expect(mockedResponse.getHeader('Content-Transfer-Encoding')).toBe('binary');
      expect(mockedResponse.getHeader('Content-Type')).toBe('image/png');
      expect(mockedResponse._getData()).toBe(expectedResult);
    });
  });
});
