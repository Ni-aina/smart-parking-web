"use client";

interface StepPaymentProps {
    planName: string;
    planPrice: number;
}

const StepPayment = ({
    planName,
    planPrice
}: StepPaymentProps) => {

    if (planName === "Enterprise" && planPrice === 79.99) return (
        <div className="mt-3 flex flex-col gap-4">
            <div className="relative p-4 rounded-sm border border-white/20 overflow-hidden">
                <div 
                    className="absolute inset-0 opacity-10 bg-linear-to-br from-transparent 
                    via-white/15 to-transparent animate-pulse" 
                />

                <div className="relative flex justify-between items-center">
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="font-semibold text-sm">{planName} Plan</h2>
                            <span 
                                className="text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-sm 
                                bg-[#FFC439] text-black animate-pulse"
                            >
                                Soon
                            </span>
                        </div>
                        <p className="text-xs text-white/40 mt-1">Billed monthly</p>
                    </div>
                    <span className="text-lg font-semibold text-white/30">
                        ${planPrice}
                        <span className="text-white/20 text-xs font-normal">/mo</span>
                    </span>
                </div>
            </div>

            <div className="flex flex-col items-center gap-1.5 py-2">
                <div className="flex items-center gap-2">
                    <div className="h-px w-8 bg-white/10" />
                    <span className="text-xs text-white/50 tracking-widest uppercase">Coming Soon</span>
                    <div className="h-px w-8 bg-white/10" />
                </div>
                <p className="text-[11px] text-white/30 text-center max-w-55">
                    We're putting the finishing touches on our Enterprise tier. Stay tuned.
                </p>
            </div>

            <button
                disabled
                className="w-full py-3 rounded-sm bg-[#FFC439] text-black font-bold
                 text-sm opacity-40 cursor-not-allowed"
            >
                Not available yet
            </button>
        </div>
    )

    return (
        <div className="mt-3 flex flex-col gap-4">
            <div className="p-4 rounded-sm border border-white/20">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="font-semibold text-sm">
                            {planName} Plan
                        </h2>
                        <p className="text-xs text-white/40 mt-1">Billed monthly</p>
                    </div>
                    <span className="text-lg font-semibold">
                        ${planPrice}
                        <span className="text-white/40 text-xs font-normal">/mo</span>
                    </span>
                </div>
            </div>
            <button
                className="w-full py-3 rounded-sm bg-[#FFC439] text-black 
                font-bold flex items-center justify-center gap-1 
                cursor-pointer hover:opacity-90 transition-opacity"
            >
                <span className="text-sm">Pay with</span>
                <span className="text-[#003087] font-extrabold italic text-sm">
                    Pay
                </span>
                <span className="text-[#009CDE] font-extrabold italic text-sm">
                    Pal
                </span>
            </button>
            <p className="text-[10px] text-white/30 text-center">
                Powered by PayPal — Secure payment processing
            </p>
        </div>
    )
}

export default StepPayment;
