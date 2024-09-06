import { Axiom } from '@axiomhq/js';
import { SERVER_ENV } from "@sve/env";  

export const axiomClient = new Axiom({
  token: SERVER_ENV.AXIOM_TOKEN!,
  orgId: SERVER_ENV.AXIOM_ORG_ID,
});
