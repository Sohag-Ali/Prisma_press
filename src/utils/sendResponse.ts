import { Response } from "express";

type Tmeta = {
    total: number;
    page: number;
    limit: number;
}
type TResponseData<T> = {
    message: string;
    success: boolean;
    statusCode: number;
    data : T;
    meta?: Tmeta;
};

export const sendResponse = <T>(res: Response, data: TResponseData<T>) => {
    res.status(data.statusCode).json({
        message: data.message,
        success: data.success,
        statusCode: data.statusCode,
        data: data.data,
        meta: data.meta
    });
}
