export function isDemoPayload(value) {
  if (
    value === null ||
    typeof value !== "object" ||
    value.mode !== "synthetic-demo" ||
    typeof value.notice !== "string" ||
    value.notice.length === 0 ||
    !Array.isArray(value.modules)
  ) {
    return false;
  }

  const ids = new Set();
  return value.modules.every((module) => {
    if (
      module === null ||
      typeof module !== "object" ||
      typeof module.id !== "string" ||
      module.id.length === 0 ||
      ids.has(module.id) ||
      typeof module.title !== "string" ||
      typeof module.description !== "string" ||
      module.status !== "planned"
    ) {
      return false;
    }

    ids.add(module.id);
    return true;
  });
}

export async function readDemoResponse(response) {
  if (!response?.ok) throw new Error("Demo API request failed");

  let payload;
  try {
    payload = await response.json();
  } catch {
    throw new Error("Demo API response was not valid JSON");
  }

  if (!isDemoPayload(payload)) throw new Error("Unexpected demo API payload");
  return payload;
}
