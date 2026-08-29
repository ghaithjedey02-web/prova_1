/**
 * Workflow definitions.
 *
 * WHY THIS PACKAGE EXISTS
 * The public demonstration is the most expensive asset on the site, and the
 * workflow it demonstrates is explicitly not yet validated — discovery calls
 * could retire RFQ→preventivo. So the demo is not an RFQ demo: it is a player
 * that renders whatever workflow it is handed.
 *
 * Switching to order entry, document chasing or email triage means authoring a
 * new definition here. It does not mean rebuilding the experience.
 */

/** A stage in the pipeline, as the visitor sees it. */
export interface WorkflowStage {
  id: string;
  /** Short label, e.g. "Estrazione". */
  label: string;
  /** One sentence explaining what happens here, in the client's language. */
  description: string;
  /**
   * What kind of work this stage represents. Drives the visual treatment —
   * `human` stages are rendered as a deliberate stop, never as another
   * automated step.
   */
  kind: 'intake' | 'machine' | 'check' | 'human' | 'output';
  /** Indicative duration in ms for the demo's paced playback. */
  durationMs: number;
}

export interface WorkflowField {
  key: string;
  label: string;
  type: 'string' | 'number' | 'boolean';
  /** Below this confidence the field is routed to a person. */
  confidenceFloor: number;
  /** Fields that drive money are marked so the UI can weight them. */
  critical?: boolean;
}

export interface WorkflowSample {
  id: string;
  /** What the visitor picks from — e.g. "Richiesta completa da cliente storico". */
  label: string;
  /** One line telling the visitor why this sample is interesting. */
  note: string;
  from: string;
  subject: string;
  body: string;
  attachments: { filename: string; sizeBytes: number }[];
  /**
   * What this sample is meant to demonstrate. Used to caption the result, and
   * to make sure the awkward cases are shown rather than hidden.
   */
  demonstrates: 'clean' | 'cross-reference' | 'refusal' | 'not-applicable' | 'filtered';
}

export interface WorkflowDefinition {
  id: string;
  /** Public name, in Italian. */
  name: string;
  /** The industry this configuration is written for. */
  sector: string;
  /** One sentence for the visitor. */
  summary: string;
  stages: WorkflowStage[];
  fields: WorkflowField[];
  samples: WorkflowSample[];
  /** Labels the UI needs that differ per workflow. */
  copy: {
    inputTitle: string;
    outputTitle: string;
    approvalLabel: string;
    approvalHint: string;
  };
}
