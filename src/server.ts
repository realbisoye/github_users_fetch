import dotenv from 'dotenv';
import app from './app';
import logger from './logger';

const result = dotenv.config();
if (result.error) {
  dotenv.config({ path: '.env.default' });
}

app.listen(app.get('port'), (): void => {
  logger.info(`🌏 Express server started at http://localhost:${app.get('port')}`);
});
