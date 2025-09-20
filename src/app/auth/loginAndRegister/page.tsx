'use client';

import React, { useState } from "react";
import { useRouter } from "next/navigation";


export default function LoginAndRegisterPage() {
    const router = useRouter();
    const [isLogin, setIsLogin] = useState(true);
    const [userData , setUserData] = useState<{email : string  , password : string}>({email : "" , password : ""});

    const  handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try{
            if(isLogin){
            const res = fetch('/api/auth/login' , {
                method : 'POST',
                headers : { 'Content-Type' : 'application/json' },
                body : JSON.stringify(userData)
            });
            const data = (await res).json();
            router.push('/');
        }else{
            const res = fetch('/api/auth/register' , {
                method : 'POST',
                headers : { 'Content-Type' : 'application/json' },      
            })
            const data = (await res).json();
            router.push('/');
        
        };
        }catch(err){
            throw new Error((err as Error).message);
        }
    }
    return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-100 dark:bg-neutral-900 transition-colors duration-300">
            <div className="backdrop-blur-lg bg-white/80 dark:bg-neutral-800/80 shadow-xl rounded-2xl p-8 w-full max-w-md border border-neutral-200 dark:border-neutral-700">
                <div className="flex justify-center mb-8 gap-2">
                    <button
                        className={`px-6 py-2 rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-blue-400 ${isLogin ? 'bg-blue-600 text-white shadow' : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200'}`}
                        onClick={() => setIsLogin(true)}
                        type="button"
                    >
                        Login
                    </button>
                    <button
                        className={`px-6 py-2 rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-purple-400 ${!isLogin ? 'bg-purple-600 text-white shadow' : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200'}`}
                        onClick={() => setIsLogin(false)}
                        type="button"
                    >
                        Register
                    </button>
                </div>
                {isLogin ? (
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <h2 className="text-2xl font-bold text-center mb-4 text-neutral-800 dark:text-neutral-100">Login</h2>
                        <div>
                            <label className="block text-neutral-700 dark:text-neutral-200 mb-1 text-sm" htmlFor="login-email">Email</label>
                            <input
                                id="login-email"
                                type="email"
                                className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-neutral-50 dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-400 text-neutral-800 dark:text-neutral-100"
                                placeholder="Enter your email"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-neutral-700 dark:text-neutral-200 mb-1 text-sm" htmlFor="login-password">Password</label>
                            <input
                                id="login-password"
                                type="password"
                                className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-neutral-50 dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-400 text-neutral-800 dark:text-neutral-100"
                                placeholder="Enter your password"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors shadow"
                        >
                            Login
                        </button>
                    </form>
                ) : (
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <h2 className="text-2xl font-bold text-center mb-4 text-neutral-800 dark:text-neutral-100">Register</h2>
                        <div>
                            <label className="block text-neutral-700 dark:text-neutral-200 mb-1 text-sm" htmlFor="register-email">Email</label>
                            <input
                                id="register-email"
                                type="email"
                                className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-neutral-50 dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-purple-400 text-neutral-800 dark:text-neutral-100"
                                placeholder="Enter your email"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-neutral-700 dark:text-neutral-200 mb-1 text-sm" htmlFor="register-password">Password</label>
                            <input
                                id="register-password"
                                type="password"
                                className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-neutral-50 dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-purple-400 text-neutral-800 dark:text-neutral-100"
                                placeholder="Create a password"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-lg transition-colors shadow"
                        >
                            Register
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}