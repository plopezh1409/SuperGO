export class IResponseData<T>{
   code : number;
   message: String;
   response: T;

   constructor(){
      this.code = 500;
      this.message = "Not Found";
      this.response =  <T>{};
   }

}
