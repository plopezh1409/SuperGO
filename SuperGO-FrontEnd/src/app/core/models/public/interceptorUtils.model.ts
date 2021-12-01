export class InterceptorUtils{
    getTime()
    {
        let dateInterceptop = new Date();
        return `${dateInterceptop.getDate().toString().padStart(2, '0')}/${
            (dateInterceptop.getMonth()+1).toString().padStart(2, '0')}/${
            dateInterceptop.getFullYear().toString().padStart(4, '0')} ${
            dateInterceptop.getHours().toString().padStart(2, '0')}:${
            dateInterceptop.getMinutes().toString().padStart(2, '0')}:${
            dateInterceptop.getSeconds().toString().padStart(2, '0')}:${
            dateInterceptop.getMilliseconds().toString()}`;
    }
}