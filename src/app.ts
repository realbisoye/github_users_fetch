import bodyParser from 'body-parser';
import compression from 'compression';
import express from 'express';
import { errors } from 'celebrate';
import routes from './routes';

const app = express();

app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('port', process.env.PORT || 3000);

app.use(routes);

app.use(errors());

export default app;
