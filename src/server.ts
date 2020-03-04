import dotenv from 'dotenv';
import app from './app';
import logger from './logger';

const result = dotenv.config();
if (result.error) {
  dotenv.config({ path: '.env.default' });
}

app.listen(app.get('port'), (): void => {
    logger.log('\x1b[36m%s\x1b[0m', // eslint-disable-line
    `🌏 Express server started at http://localhost:${app.get('port')}`);
});
