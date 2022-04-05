import { ServiceNoMagicNumber } from '../ServiceResponseCodes/service-response-codes.model';

export class InterceptorUtils{
    private readonly codeResponseMagic: ServiceNoMagicNumber = new ServiceNoMagicNumber(); 
    getTime()
    {
        const dateInterceptop = new Date();
        return `${dateInterceptop.getDate().toString().padStart(Number(this.codeResponseMagic.RESPONSE_CODE_2), '0')}/${
            (dateInterceptop.getMonth()+1).toString().padStart(Number(this.codeResponseMagic.RESPONSE_CODE_2), '0')}/${
            dateInterceptop.getFullYear().toString().padStart(Number(this.codeResponseMagic.RESPONSE_CODE_4), '0')} ${
            dateInterceptop.getHours().toString().padStart(Number(this.codeResponseMagic.RESPONSE_CODE_2), '0')}:${
            dateInterceptop.getMinutes().toString().padStart(Number(this.codeResponseMagic.RESPONSE_CODE_2), '0')}:${
            dateInterceptop.getSeconds().toString().padStart(Number(this.codeResponseMagic.RESPONSE_CODE_2), '0')}:${
            dateInterceptop.getMilliseconds().toString()}`;
    }
}