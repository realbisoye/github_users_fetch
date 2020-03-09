import fetch from 'node-fetch';
import logger from './logger';

export interface FetchResponse {
  error: boolean,
  data?: any,
  status: number,
  message?: string,
}

const request = async (query: string): Promise<FetchResponse> => {
  const url = 'https://api.github.com/graphql';
  const githubToken = process.env.GITHUB_API_KEY;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${githubToken}`,
        contentType: 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    const responseData = await response.json();
    const responseError = response.status !== 200 || responseData.errors;
    if (responseError) {
      logger.info(JSON.stringify(responseData));
    }
    return {
      error: responseError,
      status: response.status,
      message: responseData.message,
      data: responseData.data,
    };
  } catch (e) {
    logger.error(e);
    return {
      error: true,
      status: 500,
      message: 'Ecountered an error.',
    };
  }
};

export default request;
