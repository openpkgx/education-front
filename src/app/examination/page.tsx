'use client';

import { Button, Link, Typography } from "@mui/material";
import { useSearchParams } from "next/navigation";

export default function Page() {
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    return (
        <div className="flex justify-center items-center min-h-screen w-screen bg-gradient-to-r from-sky-50 via-indigo-50 to-purple-50 overflow-y-auto">
            <div className="flex flex-col justify-center items-center p-4 sm:p-6 md:p-8 border border-gray-100 rounded-lg shadow-xl bg-white/70 backdrop-blur-lg mx-4 transform -translate-y-1/2">
                <Typography variant="h6" className="mt-4 text-xl sm:text-2xl md:text-3xl font-bold text-sky-800">每日一练</Typography>
                <Typography variant="body1" className="mt-4 text-base sm:text-lg md:text-xl text-gray-700 text-center">
                    2024年下半年系统架构设计师考试上午真题(综合题)
                </Typography>

                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 md:gap-8 mt-6 sm:mt-8 md:mt-12">
                    <Button
                        variant="contained"
                        className="bg-gradient-to-r from-sky-400 to-indigo-400 hover:from-sky-500 hover:to-indigo-500 text-white font-semibold py-2 sm:py-3 px-4 sm:px-6 md:px-8 rounded-lg shadow-lg transition duration-300"
                    >
                        考试模式
                    </Button>
                    <Link href={`/examination/exampaper?id=${id}`}>
                        <Button
                            variant="contained"
                            className="bg-gradient-to-r from-blue-400 to-indigo-400 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold py-2 sm:py-3 px-4 sm:px-6 md:px-8 rounded-lg shadow-lg transition duration-300"
                        >
                            练习模式
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}