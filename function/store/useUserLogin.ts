import {create} from 'zustand';

const useLogin = create((set)=>({
    iduser : 0,
    setIdUser : (newID: any) => set(() => ({iduser:newID})),
    isLogin : false,
    setLogin :(newLogin = false) => set(() => ({isLogin:newLogin})),
    userLink : 0,
    setUserLink : (newUserLink: any) => set(() => ({userLink:newUserLink})),
    statusUser : "",
    setStatusUser : (newStatusUser: any) => set(() => ({statusUser:newStatusUser})),

}));

export default useLogin;
