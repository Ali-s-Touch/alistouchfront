"use client";

import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider as ReduxProvider } from "react-redux";
import { useDispatch } from "react-redux";
import { store } from "@/store";
import { setToken, setUser } from "@/store/authSlice";
import { api } from "@/lib/api";

const queryClient = new QueryClient();

function AuthInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();

  useEffect(() => {
    const initializeAuth = async () => {
      console.log("initializeAuth 시작");
      const token = localStorage.getItem("accessToken");
      console.log("토큰:", token);

      if (token) {
        dispatch(setToken(token));
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        try {
          const email = localStorage.getItem("userEmail");
          console.log("이메일:", email);

          if (email) {
            console.log("프로필 정보 요청");
            const response = await api.get(
              `/v1/user/member/profile?email=${email}`
            );
            console.log("프로필 응답:", response.data);

            dispatch(
              setUser({
                email: response.data.email,
                name: response.data.name,
                nationality: response.data.memberNationality,
              })
            );
          }
        } catch (error) {
          console.error("프로필 조회 실패:", error);
          // 토큰이 만료되었거나 유효하지 않은 경우 로그아웃 처리
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("userEmail");
          delete api.defaults.headers.common["Authorization"];
        }
      }
    };

    initializeAuth();
  }, [dispatch]);

  return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider store={store}>
      <QueryClientProvider client={queryClient}>
        <AuthInitializer>{children}</AuthInitializer>
      </QueryClientProvider>
    </ReduxProvider>
  );
}
