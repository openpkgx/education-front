import React from "react";

const Spinner: React.FC = () => {
    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                backgroundColor: "#f0f4f8",
            }}
        >
            <div
                style={{
                    width: "80px",
                    height: "80px",
                    position: "relative",
                }}
            >
                {[...Array(3)].map((_, index) => (
                    <div
                        key={index}
                        style={{
                            position: "absolute",
                            width: "100%",
                            height: "100%",
                            border: "8px solid transparent",
                            borderTopColor: `rgba(163, 216, 244, ${1 - index * 0.2})`, // 淡蓝色渐变
                            borderRadius: "50%",
                            animation: "spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite",
                            animationDelay: `${-0.15 * (index + 1)}s`,
                        }}
                    />
                ))}
            </div>
            <style>
                {`
          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}
            </style>
        </div>
    );
};

export default Spinner;