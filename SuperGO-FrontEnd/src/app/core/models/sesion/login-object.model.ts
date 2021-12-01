export class LoginObject {
    public employee: string;
    public p4ss: string;
    public user: string | null;

    constructor(object: any) {
        this.employee = (object.employee) ? object.employee : null;
        this.p4ss = (object.p4ss) ? object.p4ss : null;
        this.user = null;
    }   
}