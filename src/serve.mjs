/** Local preview server. `npm run serve` then open the printed URL. */
import { startServer } from './lib/server.mjs';

const { origin } = await startServer(Number(process.env.PORT ?? 4321));
console.log(origin);
