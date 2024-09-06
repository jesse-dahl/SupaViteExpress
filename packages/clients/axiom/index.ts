import { Axiom } from '@axiomhq/js';
import { SERVER_ENV } from "@sve/env";  

if (!SERVER_ENV.AXIOM_TOKEN) throw new Error('Axiom Token not found but required to log');

export const axiomClient = new Axiom({
  token: SERVER_ENV.AXIOM_TOKEN,
  orgId: SERVER_ENV.AXIOM_ORG_ID,
});
