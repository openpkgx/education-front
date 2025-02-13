"use client";
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    // 在组件挂载后进行重定向
    router.push("/login?");
  }, [router]); // 依赖于router对象
  return (
    <div>
    </div>
  );
}
