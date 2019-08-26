import { ON_REFINEMENT_UPDATE } from './types';

export const refinementUpdate = refinement => {
  return { type: ON_REFINEMENT_UPDATE, payload: refinement };
};
