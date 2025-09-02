// Simple smoke test to verify Jest setup is working
describe('Smoke Tests', () => {
  it('should run basic tests', () => {
    expect(1 + 1).toBe(2);
  });

  it('should have testing environment set up', () => {
    expect(process.env.NODE_ENV).toBe('test');
  });

  it('should have fetch mock available', () => {
    expect(global.fetch).toBeDefined();
    expect(typeof global.fetch).toBe('function');
  });

  it('should have window object available', () => {
    expect(window).toBeDefined();
    expect(window.matchMedia).toBeDefined();
  });

  it('should have document object available', () => {
    expect(document).toBeDefined();
    expect(document.createElement).toBeDefined();
  });

  it('should be able to create DOM elements', () => {
    const div = document.createElement('div');
    div.textContent = 'Hello World';
    expect(div.textContent).toBe('Hello World');
  });
});
