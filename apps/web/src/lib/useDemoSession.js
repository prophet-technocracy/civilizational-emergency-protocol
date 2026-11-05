import { useCallback, useMemo, useReducer } from "react";
import { createSession, reduceSession } from "./demoSession.mjs";

/**
 * Browser-side wrapper around the pure session reducer. State lives in this tab
 * only: nothing is posted to the API and nothing is written to storage.
 */
export function useDemoSession(level, baseContext = {}) {
  const [state, dispatch] = useReducer(reduceSession, undefined, createSession);

  const run = useCallback(
    (action, context = {}) => {
      // The reducer needs fixture context (franchise, budgets, committee id) to
      // decide, and the dispatched action is its only channel.
      dispatch({ ...action, level, context: { ...baseContext, ...context } });
    },
    [level, baseContext]
  );

  const reset = useCallback(() => dispatch({ type: "reset", level }), [level]);

  return useMemo(() => ({ state, run, reset }), [state, run, reset]);
}
