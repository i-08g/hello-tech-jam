"use client"

import React from "react";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import { AuthContextConsumer } from "./Authentication";
import { Button } from "@/components/ui/button";

// AuthContextConsumerが返すオブジェクトの型を定義
interface User {
  displayName: string;
}

interface AuthContextProps {
  loginUser: User | null;
  login: () => void;
  logout: () => void;
}

// const LoginUser: React.FC = () => {
//   // AuthContextConsumer からログインユーザ、ログイン・ログアウト処理取得
//   const { loginUser, login, logout } = AuthContextConsumer() as AuthContextProps;
//   return (
//     <div className='user_info flex flex-col items-center justify-start min-h-screen pt-36 px-8 md:px-12 lg:px-16' >
//       <UserCircleIcon className='user_icon h-[5rem] w-[5rem] rotate-0 scale-100 transition-all '/>
//       <p className='user_name flex items-center space-x-4 mb-8'>
//         {loginUser ? loginUser.displayName : "ゲスト"}
//       </p>
//       <Button className='login_btn' onClick={loginUser ? logout : login}>
//         {loginUser ? "logout" : "login"}
//       </Button>
//     </div>
//   );
// }

// export default LoginUser;


const LoginUser: React.FC = () => {
    // AuthContextConsumer からログインユーザ、ログイン・ログアウト処理取得
    const { loginUser, login, logout } = AuthContextConsumer() as AuthContextProps;
    return (
        <div className='flex justify-end items-center p-4'>
            <div className='text-right'>
                <div className='user_info'>
                    <UserCircleIcon className='user_icon h-[5rem] w-[5rem] rotate-0 scale-100 transition-all' />
                    <p className='user_name flex items-center space-x-4 mb-8'>
                        {loginUser ? loginUser.displayName : "ゲスト"}
                    </p>
                    <Button className='login_btn' onClick={loginUser ? logout : login}>
                        {loginUser ? "logout" : "login"}
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default LoginUser;
