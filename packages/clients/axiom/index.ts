import { Axiom } from '@axiomhq/js';
require('dotenv').config({ path: "../../../.env" })

if (!process.env.NEXT_PUBLIC_AXIOM_TOKEN) throw new Error('Axiom Token not found but required to log');

export const axiomClient = new Axiom({
  token: process.env.NEXT_PUBLIC_AXIOM_TOKEN,
  orgId: process.env.NEXT_PUBLIC_AXIOM_ORG_ID,
});
