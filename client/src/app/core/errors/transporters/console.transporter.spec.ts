import { ConsoleTransporter } from './console.transporter';

describe('ConsoleTransporter', () => {
  let transporter: ConsoleTransporter<string>;

  beforeEach(() => {
    transporter = new ConsoleTransporter();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call console.info for INFO level', () => {
    const consoleInfoSpy = jest.spyOn(console, 'info').mockImplementation();

    transporter.log('Info message', 'INFO');

    expect(consoleInfoSpy).toHaveBeenCalledWith('Info message');

    consoleInfoSpy.mockRestore();
  });

  it('should call console.debug for DEBUG level', () => {
    const consoleDebugSpy = jest.spyOn(console, 'debug').mockImplementation();

    transporter.log('Debug message', 'DEBUG');

    expect(consoleDebugSpy).toHaveBeenCalledWith('Debug message');

    consoleDebugSpy.mockRestore();
  });

  it('should call console.warn for WARN level', () => {
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

    transporter.log('Warn message', 'WARN');

    expect(consoleWarnSpy).toHaveBeenCalledWith('Warn message');

    consoleWarnSpy.mockRestore();
  });

  it('should call console.error for ERROR level', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    transporter.log('Error message', 'ERROR');

    expect(consoleErrorSpy).toHaveBeenCalledWith('Error message');

    consoleErrorSpy.mockRestore();
  });
});
