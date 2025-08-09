"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Spinner from "./ui/spinner";
import { useAuth } from "./context/AuthContext";

type AuthGuardProps = {
  children: React.ReactNode;
  allowedRoles: string[];
};

export const AuthGuard = ({ children, allowedRoles }: AuthGuardProps) => {
  const { user } = useAuth();
  const router = useRouter();
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    if (user) {
      if (allowedRoles.includes(user.role)) {
        setIsVerified(true);
      } else {
        console.error("Akses ditolak: Role tidak sesuai.");
        router.push("/");
      }
    } else {
      const token = localStorage.getItem("authToken");
      if (!token) {
        router.push("/");
      }
    }
  }, [user, router, allowedRoles]);

  if (!isVerified) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthGuard;
