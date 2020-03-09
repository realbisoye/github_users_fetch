import { Request, Response } from 'express';
import request from '../request';
import logger from '../logger';
import { searchQuery } from '../query/search';
import { userDataQuery } from '../query/user';

export interface APIResponse {
  error: boolean,
  data: any,
  status: number,
  message?: string,
}

const replyWithError = (res: Response, status: number, message?: string): Response => {
  const responseStatus = status === 200 ? 400 : status;
  return res.status(responseStatus)
    .send({
      error: true,
      message: message || 'Error fetching data',
    });
};

export const searchUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { username, language } = req.query;
    const languages = language.split(',');
    const primaryLanguage = languages[0];

    const languageQuery = searchQuery(username, primaryLanguage);
    const searchResult = await request(languageQuery);
    const userLanguages: string[] = [];
    let queryResponse: any[] = [];

    if (searchResult.error) {
      return replyWithError(res, searchResult.status, searchResult.message);
    }

    const { search: { nodes } } = searchResult.data;

    if (!nodes || !nodes.length) { // use fallback if result is empty
      const [primary, ...otherLanguages] = languages;
      const otherLanguagesQuery = searchQuery(username, otherLanguages.join(','));
      const fallbackResults = await request(otherLanguagesQuery);
      queryResponse = fallbackResults.data.search.nodes;
    } else {
      queryResponse = nodes;
    }

    queryResponse.forEach((node: any) => { // get user languages
      node.languages.nodes.forEach((lang: {name: string}) => {
        if (userLanguages.indexOf(lang.name) < 0) {
          userLanguages.push(lang.name);
        }
      });
    });

    const userQuery = userDataQuery(username);
    const userResult = await request(userQuery);

    if (userResult.error) {
      return replyWithError(res, userResult.status, userResult.message);
    }

    const {
      user: {
        login, name, avatarUrl, followers: { totalCount },
      },
    } = userResult.data;
    const responseData = {
      username: login,
      name,
      avatarUrl,
      numberOfFollowers: totalCount,
      languages: userLanguages,
    };

    return res.status(200)
      .send({
        error: false,
        body: responseData,
      });
  } catch (e) {
    logger.error(e);
    return replyWithError(res, 500, 'Encountered an error');
  }
};
