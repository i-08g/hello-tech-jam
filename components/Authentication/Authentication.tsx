"use client"
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  User
} from "firebase/auth"
import { useEffect, useState, createContext, useContext, ReactNode } from "react"

// Your web app's Firebase configuration
const AuthContext = createContext<AuthContextType | undefined>(undefined)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTHDOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECTID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGEBUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGINGSENDERID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APPID
}
// Initialize Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const provider = new GoogleAuthProvider()

// 型定義
interface AuthContextType {
  loginUser: User | null
  login: () => Promise<void>
  logout: () => Promise<void>
}

// AuthContextProvider (Provider)
interface AuthContextProviderProps {
  children: ReactNode
}

export const AuthContextProvider: React.FC<AuthContextProviderProps> = ({ children }) => {
  // ログインユーザ
  const [loginUser, setLoginUser] = useState<User | null>(null)

  // 起動時ログイン処理(既にログインしてる場合, ユーザ設定)
  useEffect(() => {
    // auth 初期化時にログインユーザ設定
    const unsubscribe = auth.onAuthStateChanged(user => setLoginUser(user))
    return () => unsubscribe() // Clean up the subscription on unmount
  }, [])

  // ログイン処理
  const login = async () => {
    // Google ログインのポップアップ表示して認証結果取得
    const result = await signInWithPopup(auth, provider)
    // 認証結果より user 設定
    setLoginUser(result.user)
  }

  // ログアウト処理
  const logout = async () => {
    await signOut(auth)
    setLoginUser(null)
  }

  // ログイン情報設定したProvider
  return (
    <AuthContext.Provider
      value={{
        loginUser,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>

  )
}

// AuthContextConsumer (useContext) # Provider で囲った範囲で使う必要あり
export const AuthContextConsumer = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("AuthContextConsumer must be used within an AuthContextProvider")
  }
  return context
}
