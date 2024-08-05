export interface Users {
  id: number;
  email: string;
  nickname: string;
  birth: string;
  phone: string;
  gender: 'MALE' | 'FEMALE';
  imgUrl: string;
}

export interface UserDataResponseType {
  data: Users;
  status: string;
  message: string;
}
