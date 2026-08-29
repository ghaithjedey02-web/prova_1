export * from './types.js';
export { rfqPreventivo } from './rfq-preventivo.js';

import { rfqPreventivo } from './rfq-preventivo.js';
import type { WorkflowDefinition } from './types.js';

/** Every workflow the demonstration can render. Adding one is a data change. */
export const workflows: Record<string, WorkflowDefinition> = {
  [rfqPreventivo.id]: rfqPreventivo,
};

export const defaultWorkflowId = rfqPreventivo.id;
