import { createConnection, createServer, createSimpleProject } from '@volar/language-server/node';
import { create as createDialtoneService } from './volar-service-dialtone';
import { dialtoneLanguagePlugin } from "./language-plugin";

const connection = createConnection();
const server = createServer(connection);

connection.listen();

connection.onInitialize((params) => {
  return server.initialize(
    params,
    createSimpleProject([dialtoneLanguagePlugin]),
    [
      createDialtoneService()
    ]
  );
});

connection.onInitialized(server.initialized);

connection.onShutdown(server.shutdown);
