import { Suspense } from 'react';
import LoginContent from '@/app/components/Login';

const LoginPage = () => {
  return (
    <Suspense fallback={<div>Đang tải...</div>}>
      <div className="">
        <LoginContent />
      </div>
    </Suspense>
  );
};

export default LoginPage;