export class DropdownFunctionality {

   createValues(cpDataContent:any){
      for(const value in cpDataContent){
         cpDataContent[value].forEach((ele:any) => {
           for(const entries in ele){
             if(typeof ele[entries] === 'number'){
               ele['ky'] = ele[entries];
             }
             else{
               ele['value'] = ele[entries];
             }
             delete ele[entries];
           }
         });
       }
       return cpDataContent;
   }
}
