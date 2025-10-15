/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { TErrorSources, TGnericErrorResponse } from "../types";

const handleDuplicateError = (error: any): TGnericErrorResponse => {
  const match = error.errorResponse.errmsg.match(/"([^"]+)"/);
  const extractedMessage = match && match[1];
  const errorSources: TErrorSources = [
    {
      path: "",
      message: `${extractedMessage} is already exist.`,
    },
  ];
  const statusCode = 400;

  return {
    statusCode,
    message: `${extractedMessage} is already exist.`,
    errorSources,
  };
};

export default handleDuplicateError;
