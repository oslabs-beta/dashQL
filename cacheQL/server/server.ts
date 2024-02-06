import * as express from 'express';
import * as path from 'path';
import queryRouter from './routers/queryRouter.ts';
const app = express();
const PORT = 5001;
app.use(express.json());

app.use(express.static(path.resolve(__dirname, '../client')));

app.use('/api/query', queryRouter);
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
export default app;
