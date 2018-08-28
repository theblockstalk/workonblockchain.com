export class User 
{
    _id: string;
    email: string;
    password: string;
    type: string;
    _creator:string;
    social_type:string; 
    email_hash:string;
    ref_link:string;
    is_admin: number;
    is_approved:number;
    jwt_token :string;
}