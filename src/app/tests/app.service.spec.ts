import { AppService } from "../app.service";

describe('AppService', () => {
  let service: AppService;

  beforeEach(() => {
    service = new AppService();
  });

  it('should return "Hello World!"', () => {
    expect(service.getHello()).toBe('Hello World!');
  });

  it("Should return something different and failed", () => {
    expect(service.getHello()).not.toBe("Non Hello World");
  })
});