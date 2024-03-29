import './init-aliases';
import express from 'express';
import { createServer } from "http";
import cors from "cors";
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { PORT, NODE_ENV } from '@config/config';
import apolloServer from '@server/initGraphQLServer';
import { httpsRedirect, wwwRedirect } from '@lib/http-redirect';
import ProducerFactory from '../kakfa/producer';

const router = require( '../rabbitmq/send')
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
const IS_DEV = NODE_ENV === 'development';
const producerFactory = new ProducerFactory();

async function producer() {
await producerFactory.start();
const messages = [{ a: 'message1' }, { a: 'message2' }];
await producerFactory.sendBatch(messages);
await producerFactory.shutdown();
}


producer()

app.use(cors());
app.enable('trust proxy');
app.use(helmet({ 
  crossOriginEmbedderPolicy: !IS_DEV,
  contentSecurityPolicy: !IS_DEV, 
}));
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use('/message', router);


// redirects should be ideally setup in reverse proxy like nignx
if (NODE_ENV === 'production') {
  app.use('/*', httpsRedirect());

  app.get('/*', wwwRedirect());

  app.use(rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  }));
}

async function startServer() {
  await apolloServer.start();
  apolloServer.applyMiddleware({ app, path: "/graphql" });
}

startServer();

const httpServer = createServer(app);

httpServer.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.info(`\n\nExpress listen at http://localhost:${PORT} \n`);
});