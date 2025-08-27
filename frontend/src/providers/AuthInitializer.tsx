import { useAuthInit } from '@/hooks/auth/useAuthInit';

const AuthInitializer = ({ children }: { children: React.ReactNode }) => {
  useAuthInit();
  return <>{children}</>;
};

export default AuthInitializer;