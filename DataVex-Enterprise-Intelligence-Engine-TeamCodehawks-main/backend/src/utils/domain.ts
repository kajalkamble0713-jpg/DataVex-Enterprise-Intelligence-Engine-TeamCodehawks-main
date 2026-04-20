import isFQDN from "validator/lib/isFQDN";

export const normalizeDomain = (input: string): string => {
  const trimmed = input.trim().toLowerCase();
  const withoutProtocol = trimmed.replace(/^https?:\/\//, "");
  const withoutPath = withoutProtocol.split("/")[0] ?? "";
  return withoutPath.replace(/\.$/, "");
};

export const isValidDomain = (domain: string): boolean => {
  return isFQDN(domain, {
    allow_trailing_dot: false,
    allow_underscores: false,
    require_tld: true
  });
};
