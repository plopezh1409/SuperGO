import { ServiceNoMagigNumber } from "../ServiceResponseCodes/service-response-codes.model";

export class InterceptorUtils{
    private readonly codeResponseMagic: ServiceNoMagigNumber = new ServiceNoMagigNumber(); 
    getTime()
    {
        let dateInterceptop = new Date();
        return `${dateInterceptop.getDate().toString().padStart(Number(this.codeResponseMagic.NoMagigNumber_2), '0')}/${
            (dateInterceptop.getMonth()+1).toString().padStart(Number(this.codeResponseMagic.NoMagigNumber_2), '0')}/${
            dateInterceptop.getFullYear().toString().padStart(Number(this.codeResponseMagic.NoMagigNumber_4), '0')} ${
            dateInterceptop.getHours().toString().padStart(Number(this.codeResponseMagic.NoMagigNumber_2), '0')}:${
            dateInterceptop.getMinutes().toString().padStart(Number(this.codeResponseMagic.NoMagigNumber_2), '0')}:${
            dateInterceptop.getSeconds().toString().padStart(Number(this.codeResponseMagic.NoMagigNumber_2), '0')}:${
            dateInterceptop.getMilliseconds().toString()}`;
    }
}