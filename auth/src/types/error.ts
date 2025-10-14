export type TErrorSources = Array<{
  path: string | number;
  message: string;
}>;

export type TGnericErrorResponse = {
  statusCode: number;
  message: string;
  errorSources: TErrorSources;
};
