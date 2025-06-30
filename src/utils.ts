export const logFetch = (url: string, init?: RequestInit) => {
  console.log(`Fetch ${url}`);
  return fetch(url, init);
};

export const createGetMandatoryParameter = (name: string) => (): string => {
  if (process.env[name]) {
    return process.env[name] as string;
  }
  if (process.env["CI"]) {
    return "test";
  }
  throw new Error(
    `You need to define the environment variable ${name} in the lambda config`
  );
};

export const createGetMandatoryNumberParameter = (name: string) => {
  const getMandatoryParam = createGetMandatoryParameter(name);
  return () => {
    const param = getMandatoryParam();
    try {
      return parseInt(param);
    } catch (e) {
      throw new Error(
        `Could not parse param ${name} with value ${param} as integer`
      );
    }
  };
};
