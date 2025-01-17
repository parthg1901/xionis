import { app } from './app';
import mongoose from 'mongoose';

mongoose
  .connect(process.env.MONGO_URI || '')
  .then(() => {
    const server = app.listen(process.env.PORT, () => {
      console.log('connected to db & listening on port', process.env.PORT);
    });

    process.on('SIGINT', function () {
      server.close();
      console.log('Server closed successfully');
    });
  })
  .catch((error) => {
    console.log(error);
  });