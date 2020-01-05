import { Test, TestingModule } from '@nestjs/testing';
import * as mocks from 'node-mocks-http';

import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

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

  it('should get the screenshot of a product', async () => {
    const expectedResult = new Buffer('Test');
    jest.spyOn(productsService, 'takeProductScreenshot').mockResolvedValue(expectedResult);
    const mockedResponse = mocks.createResponse();

    await productsController.takeProductScreenshot(mockedResponse);
    expect(mockedResponse.getHeader('Content-Transfer-Encoding')).toBe('binary');
    expect(mockedResponse.getHeader('Content-Type')).toBe('image/png');
    expect(mockedResponse._getData()).toBe(expectedResult);
  });
});
