"use client";

import {
    Check,
    ChevronLeft,
    ChevronRight
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import StepAccount from "@/components/Sign-up/StepAccount";
import StepPlan from "@/components/Sign-up/StepPlan";
import StepPayment from "@/components/Sign-up/StepPayment";

const plans = [
    {
        id: "basic",
        name: "Basic",
        price: 9.99,
        features: ["Up to 20 spots", "Basic analytics"]
    },
    {
        id: "pro",
        name: "Pro",
        price: 29.99,
        popular: true,
        features: ["Up to 200 spots", "Advanced analytics", "Priority support"]
    },
    {
        id: "enterprise",
        name: "Enterprise",
        price: 79.99,
        features: ["Unlimited spots", "Real-time analytics", "Dedicated support", "Custom integrations"]
    }
]

const steps = ["Account", "Plan", "Payment"];

const SignUp = () => {
    const [step, setStep] = useState(0);
    const [showPassword, setShowPassword] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState("pro");
    
    const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });

    const activePlan = plans.find(p => p.id === selectedPlan);

    const handleShowPassword = () => setShowPassword(prev => !prev);

    const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const handleNext = () => {
        if (step === 0) {
            if (!form.name || !form.email || !form.password || !form.confirmPassword) {
                toast.error("All fields are required");
                return;
            }
            if (form.name.length < 6) {
                toast.error("Full name must be at least 6 characters");
                return;
            }
            if (!isValidEmail(form.email)) {
                toast.error("Invalid email address");
                return;
            }
            if (form.password.length < 6) {
                toast.error("Password must be at least 6 characters");
                return;
            }
            if (form.password !== form.confirmPassword) {
                toast.error("Passwords do not match");
                return;
            }
        }
        setStep(prev => prev + 1);
    }

    return (
        <div className="grid w-full h-dvh sm:place-items-center">
            <div
                className={`
                    flex flex-col space-y-4 text-white rounded-xl p-8
                    ${step === 0 ? "sm:w-xl" : "sm:w-md"} sm:bg-white/5 sm:shadow-2xl"
                `}
            >
                <div className="flex lg:justify-center mb-6">
                    <div className="relative w-48 h-16">
                        <Image
                            src={"/images/smart-parking.png"}
                            alt="Smart parking"
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            priority
                        />
                    </div>
                </div>
                <div className="flex items-center justify-center gap-2 mb-4">
                    {
                        steps.map((label, i) => (
                            <div key={label} className="flex items-center gap-2">
                                <div
                                    className={`w-7 h-7 rounded-full flex items-center justify-center 
                                text-xs font-semibold transition-colors ${i <= step
                                            ? "bg-white text-black"
                                            : "border border-white/30 text-white/30"
                                        }`}
                                >
                                    {
                                        i < step ?
                                            <Check size={12} /> :
                                            i + 1
                                    }
                                </div>
                                <span
                                    className={`text-xs hidden sm:inline ${i <= step ? "text-white" : "text-white/30"
                                        }`}
                                >
                                    {label}
                                </span>
                                {
                                    i < steps.length - 1 &&
                                    <div
                                        className={`w-8 h-px ${i < step ? "bg-white" : "bg-white/20"
                                            }`}
                                    />
                                }
                            </div>
                        ))}
                </div>
                {
                    step === 0 &&
                    <StepAccount
                        form={form}
                        setForm={setForm}
                        showPassword={showPassword}
                        handleShowPassword={handleShowPassword}
                    />
                }
                {
                    step === 1 &&
                    <StepPlan
                        plans={plans}
                        selectedPlan={selectedPlan}
                        setSelectedPlan={setSelectedPlan}
                    />
                }
                {
                    step === 2 && activePlan &&
                    <StepPayment
                        planName={activePlan.name}
                        planPrice={activePlan.price}
                    />
                }
                <div className="flex justify-between items-center mt-4">
                    {
                        step > 0 ?
                            <button
                                onClick={() => setStep(prev => prev - 1)}
                                className="flex items-center gap-1 text-sm 
                                cursor-pointer hover:opacity-80"
                            >
                                <ChevronLeft size={16} /> Back
                            </button>
                            :
                            <div />
                    }
                    {
                        step < 2 &&
                        <button
                            onClick={handleNext}
                            className="flex items-center gap-2 bg-white text-black 
                            px-4 py-2 rounded-sm text-sm font-semibold
                            cursor-pointer hover:opacity-80"
                        >
                            Next <ChevronRight size={14} />
                        </button>
                    }
                </div>
                <div className="flex flex-wrap justify-end items-center gap-2">
                    <h1 className="text-sm">Already have an account ?</h1>
                    <Link
                        href={"/auth/sign-in"}
                        className="text-sm hover:underline"
                    >
                        Sign in
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default SignUp;
