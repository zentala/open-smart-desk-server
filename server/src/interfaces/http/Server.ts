import express, { Express, Request, Response, NextFunction } from 'express';

class Server {
  private config: any; // Wstaw odpowiedni typ dla config
  private logger: any; // Wstaw odpowiedni typ dla logger
  private express: Express;

  constructor({ config, logger }: { config: any, logger: any }) {
    this.config = config;
    this.logger = logger;
    this.express = express();

    this.express.disable('x-powered-by');
    this.express.use(express.static(this.config.http.static));

    // Dodaj obsługę ścieżki textures, jeśli jest potrzebna
    // this.express.get('/textures', (req: Request, res: Response) => {
    //   const texturesPath = path.join(__dirname, '../client/textures');
    //   if (!fs.existsSync(texturesPath))
    //     res.send([]);
    //   else
    //     res.send(walkSync("./client/textures", {globs: ["**/*.png"]}));
    // });

    // Obsługa błędów 404
    // this.express.use((req: Request, res: Response, next: NextFunction) => {
    //   var err = new Error('Not Found');
    //   err.status = 404;
    //   next(err);
    // });
  }

  start(): Promise<any> {
    return new Promise<any>((resolve) => {
      const http = this.express.listen(this.config.http.port, () => {
        const { port } = http.address();
        this.logger.info(`HTTP server started at port ${port}`);
        resolve(http);
      });
    });
  }
}

export default Server;
