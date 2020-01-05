import { ProductScreenshotQuery } from './product-screenshot-query';

describe('Product Screenshot Query', () => {
  let productScreenshotQuery: ProductScreenshotQuery;

  beforeEach(() => {
    productScreenshotQuery = new ProductScreenshotQuery();
  });

  it('should be defined', () => {
    expect(productScreenshotQuery);
  });

  describe('toViewport', () => {
    it('should return a default viewport', () => {
      expect(productScreenshotQuery.toViewport()).toEqual({
        height: 720,
        width: 1280
      });
    });

    it('should return a viewport defined by the resolution', () => {
      productScreenshotQuery.resolution = '2x1';
      expect(productScreenshotQuery.toViewport()).toEqual({
        height: 1,
        width: 2
      });
    });
  });
});
