const path = require('path');

describe('analyze function', () => {
  const event = {
    httpMethod: 'POST',
    body: JSON.stringify({ imageBase64: 'imgdata', prompt: 'Hi' })
  };

  beforeEach(() => {
    jest.resetModules();
  });

  test('returns 500 status when OPENAI_API_KEY is missing', async () => {
    delete process.env.OPENAI_API_KEY;

    jest.doMock('openai', () => {
      return jest.fn().mockImplementation(() => ({
        chat: { completions: { create: jest.fn() } }
      }));
    });

    const { handler } = require('./analyze');
    const response = await handler(event, {});
    expect(response.statusCode).toBe(500);
  });

  test('returns 200 and JSON when OpenAI mock returns a message', async () => {
    process.env.OPENAI_API_KEY = 'key';

    const createMock = jest.fn().mockResolvedValue({
      choices: [{ message: { content: 'analysis' } }],
      usage: { total_tokens: 1 }
    });

    jest.doMock('openai', () => {
      return jest.fn().mockImplementation(() => ({
        chat: { completions: { create: createMock } }
      }));
    });

    const { handler } = require('./analyze');
    const response = await handler(event, {});
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toEqual({
      result: 'analysis',
      usage: { total_tokens: 1 }
    });
  });
});
