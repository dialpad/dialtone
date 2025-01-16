import { createConnection, createServer, createSimpleProject } from '@volar/language-server/node';
import { create as createDialtoneTokensService } from './services/dialtone-tokens';
import { create as createDialtoneUtilityClassService } from './services/dialtone-classes';
import { create as createDialtoneComponentsService } from './services/dialtone-components';
import { dialtoneLanguagePlugin } from "./language-plugin";

const connection = createConnection();
const server = createServer(connection);

connection.listen();

connection.onInitialize((params) => {
  return server.initialize(
    params,
    createSimpleProject([dialtoneLanguagePlugin]),
    [
      createDialtoneTokensService(),
      createDialtoneUtilityClassService(),
      createDialtoneComponentsService(),
    ]
  );
});

connection.onInitialized(server.initialized);

connection.onShutdown(server.shutdown);
