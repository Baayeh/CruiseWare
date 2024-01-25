import { Request, Response } from "express";

export const errorMessage = (
    res: Response,
    statusCode: number,
    error: string
) => {
    const responseObject = { error };
    return res.status(statusCode).send(responseObject);
};

export const successMessage = (
    res: Response,
    statusCode: number,
    message: string,
    data: unknown = []
) => {
    const responseObject = { message, data };
    return res.status(statusCode).send(responseObject);
};

export const handleError = (err: unknown, req: Request) => {
    console.log(`
  Error caught at ${req.path},
  
  Request body: ${JSON.stringify(req.body)},
  Request Params: ${JSON.stringify(req.params)},
  Request Query: ${JSON.stringify(req.query)},

  Error Message: ${(err as Error).message}
  `);
};
