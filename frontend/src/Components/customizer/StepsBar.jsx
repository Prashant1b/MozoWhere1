import React from "react";

export default function StepsBar({ step }) {
    const steps = [
        "Pick Color & Size",
        "Finalise Design",
        "Preview",
    ];

    return (
        <div className="bg-gray-100 border-b border-gray-200">
            {/* Premium Customize Header */}
            <div className="bg-white border-b border-gray-100">
                <div className="max-w-4xl mx-auto px-4 py-8 text-center">

                    <span className="text-xs font-semibold tracking-widest uppercase text-gray-500">
                        Mozowhere Studio
                    </span>

                    <h1 className="mt-3 text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                        Design & Customization
                    </h1>

                    <p className="mt-3 text-gray-600 text-sm sm:text-base max-w-xl mx-auto">
                        Personalize your T-shirt by choosing color, size and adding your own creative touch.
                    </p>

                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-6">

                <div className="flex items-center justify-between relative">

                    {/* Connecting Line */}
                    <div className="absolute top-4 left-0 right-0 h-[3px] bg-gray-300 z-0">
                        <div
                            className="h-full bg-green-500 transition-all duration-300"
                            style={{ width: `${((step - 1) / 2) * 100}%` }}
                        />
                    </div>

                    {steps.map((label, index) => {
                        const n = index + 1;
                        const done = n < step;
                        const active = n === step;

                        return (
                            <div
                                key={n}
                                className="relative z-10 flex flex-col items-center text-center w-1/3"
                            >
                                {/* Circle */}
                                <div
                                    className={[
                                        "h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold transition",
                                        done
                                            ? "bg-green-500 text-white"
                                            : active
                                                ? "bg-white border-2 border-gray-800 text-gray-900"
                                                : "bg-white border-2 border-gray-300 text-gray-500",
                                    ].join(" ")}
                                >
                                    {done ? "✓" : n}
                                </div>

                                {/* Label */}
                                <div
                                    className={[
                                        "mt-3 text-xs sm:text-sm",
                                        active
                                            ? "font-bold text-gray-900"
                                            : "text-gray-600",
                                    ].join(" ")}
                                >
                                    {label}
                                </div>
                            </div>
                        );
                    })}
                </div>

            </div>
        </div>
    );
}
