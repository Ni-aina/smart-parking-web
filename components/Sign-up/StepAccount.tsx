"use client";

import { Eye, EyeClosed } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

interface FormState {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

interface StepAccountProps {
    form: FormState;
    setForm: Dispatch<SetStateAction<FormState>>;
    showPassword: boolean;
    handleShowPassword: () => void;
}

const StepAccount = ({
    form,
    setForm,
    showPassword,
    handleShowPassword
}: StepAccountProps) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col gap-3">
                <h1 className="text-md font-semibold">Full name</h1>
                <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    className="p-2 focus-within:outline-none border border-white rounded-sm"
                    required
                />
            </div>
            <div className="flex flex-col gap-3">
                <h1 className="text-md font-semibold">Email</h1>
                <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    className="p-2 focus-within:outline-none border border-white rounded-sm"
                    required
                />
            </div>
            <div className="flex flex-col gap-3">
                <h1 className="text-md font-semibold">Password</h1>
                <div className="flex items-center gap-2 w-full p-2 rounded-sm border border-white">
                    <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={form.password}
                        onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                        className="w-full focus-within:outline-none"
                        required
                    />
                    <div className="w-[24px] cursor-pointer">
                        {
                            showPassword ?
                                <Eye onClick={handleShowPassword} size={16} /> :
                                <EyeClosed onClick={handleShowPassword} size={16} />
                        }
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-3">
                <h1 className="text-md font-semibold">Confirm password</h1>
                <div className="flex items-center gap-2 w-full p-2 rounded-sm border border-white">
                    <input
                        type={showPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={form.confirmPassword}
                        onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))}
                        className="w-full focus-within:outline-none"
                        required
                    />
                </div>
            </div>
        </div>
    )
}

export default StepAccount;
