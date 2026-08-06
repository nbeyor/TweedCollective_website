/**
 * The example protocols pinned at the top of the protocol picker.
 *
 * Chosen for contrast with the drafted NSCLC brief (different therapeutic
 * area and phase) and for data richness — both carry full eligibility,
 * endpoint, amendment, and site rows, so every standard analysis has material.
 * Swap the IDs here to feature different corpus protocols.
 */

export interface ExampleProtocol {
  protocol_id: string
  label: string
  descriptor: string
}

export const EXAMPLE_PROTOCOLS: ExampleProtocol[] = [
  {
    protocol_id: 'TCX-0056',
    label: 'Familial Hypercholesterolemia — Phase 3',
    descriptor: 'Cardiometabolic · 3 arms · N=1,056 · 41 sites · 6 amendments',
  },
  {
    protocol_id: 'TCX-0028',
    label: 'Rheumatoid Arthritis — Phase 2',
    descriptor: 'Immunology & Inflammation · 2 arms · N=410 · 19 sites · 5 amendments',
  },
]
