export class AppError extends Error{
    errorCode: any;
    statusCode: any;
    constructor(mssge:any,statusCode:any){
        super(mssge)
        this.statusCode=statusCode
    }
}

export const removeDuplicates = (arr:any):any[] => {
    const strArr = arr.map((obj:any) => JSON.stringify(obj));
    const uniq = [...new Set(strArr)].map((u:any) => JSON.parse(u));
    return uniq;
  };