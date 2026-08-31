/**
 * The film's chapter boundaries on the film clock, in seconds.
 *
 * Lives in its own module so the wrapper (which owns the clock) can read it
 * without statically importing FilmScene — that would pull three.js into the
 * initial bundle, and the WebGL stage must stay lazy.
 */
export const T = {
  chaos: 0,
  beam: 4.5,
  grid: 8.0,
  map: 13.0,
  gate: 17.5,   // the clock stops here until a person decides
  flow: 17.5,   // resumes into the flow on approval
  result: 21.0,
  end: 25.0,
} as const;
