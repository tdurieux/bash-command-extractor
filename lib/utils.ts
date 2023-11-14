function isEmpty(value) {
  if (value === null || value === undefined) {
    return true;
  }

  if (Array.isArray(value)) {
    return value.every(isEmpty);
  } else if (typeof value === "object") {
    return Object.values(value).every(isEmpty);
  }

  return false;
}

export function jsonReplacer(_, value: any) {
  return isEmpty(value) ? undefined : value;
}
