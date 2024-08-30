"use client"

import React from "react";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import { AuthContextConsumer } from "./Authentication";
import { Button } from "@/components/ui/button";

interface User {
  displayName: string;
}

interface AuthContextProps {
  loginUser: User | null;
  login: () => void;
  logout: () => void;
}

export const LoginUser: React.FC = () => {
    const { loginUser, login, logout } = AuthContextConsumer() as AuthContextProps;
    return (
        <div className="flex items-center space-x-4">
            <UserCircleIcon className="h-10 w-10 text-gray-500" />
            <p className="text-sm font-medium">
                {loginUser ? loginUser.displayName : "ゲスト"}
            </p>
            <Button 
                className="text-sm" 
                variant="outline" 
                onClick={loginUser ? logout : login}
            >
                {loginUser ? "Logout" : "Login"}
            </Button>
        </div>
    );
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



