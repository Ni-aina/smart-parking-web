interface ComingSoonProps {
    name: string;
    price: number;
}

const ComingSoon = ({
    name,
    price
}: ComingSoonProps) => {
    return (
        <div className="mt-3 flex flex-col gap-4">
            <div className="relative p-4 rounded-sm border border-white/20 overflow-hidden">
                <div 
                    className="absolute inset-0 opacity-10 bg-linear-to-br from-transparent 
                    via-white/15 to-transparent animate-pulse" 
                />

                <div className="relative flex justify-between items-center">
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="font-semibold text-sm">{name} Plan</h2>
                            <span 
                                className="text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-sm 
                                bg-blue-950 text-white animate-pulse"
                            >
                                Soon
                            </span>
                        </div>
                        <p className="text-xs text-white/40 mt-1">Billed monthly</p>
                    </div>
                    <span className="text-lg font-semibold text-white/30">
                        ${price}
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
                className="w-full py-3 rounded-sm bg-blue-950 text-white font-bold
                 text-sm opacity-60 cursor-not-allowed"
            >
                Not available yet
            </button>
        </div>
    )
}
 
export default ComingSoon;