import { ChevronDown, ChevronUp } from "lucide-react";
import { ChangeEvent, useEffect, useState } from "react";

interface InputNumberInterface {
    name: string;
    value: string;
    min?: number;
    max?: number;
    handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const InputNumber = ({
    name,
    value,
    min = -Infinity,
    max = Infinity,
    handleChange
}: InputNumberInterface) => {
    const [input, setInput] = useState(value);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setInput(value);
        handleChange(e);
    }

    const handleIncreaseInput = () => {
        setInput(prev => `${Math.min(max, Number(prev) + 1)}`);
    }

    const handleDecreaseInput = () => {
        setInput(prev => `${Math.max(min, Number(prev) - 1)}`);
    }

    return (
        <div className="relative w-full">
            <input
                className="w-full outline-none px-4 py-2 border border-white/10 rounded-sm"
                name={`${name}`}
                type="text"
                inputMode="decimal"
                pattern="[0-9]*[.]?[0-9]*"
                value={input}
                onChange={handleInputChange}
                min={min}
                max={max}
                required
            />
            <div className="absolute inset-y-0 right-3 flex flex-col justify-center">
                <ChevronUp
                    size={16}
                    className="text-red-500 cursor-pointer"
                    onClick={handleIncreaseInput}
                />
                <ChevronDown
                    size={16}
                    className="text-red-500 mt-[-3px] cursor-pointer"
                    onClick={handleDecreaseInput}
                />
            </div>
        </div>
    )
}

export default InputNumber;