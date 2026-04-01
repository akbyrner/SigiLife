import { Navigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';


type RouteStatus = "loading" | "authenticated" | "needs-profile" | "unauthenticated";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<RouteStatus>('loading');

  useEffect(() => {
    fetch('/api/auth/me', { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => {
        if (!data.user) {
          setStatus('unauthenticated')
        } else if (data.needsProfile) {
          setStatus('needs-profile');
        } else {
          setStatus('authenticated')
        }
      })
      .catch(() => {
        setStatus('unauthenticated')
      });
  }, []);

  if (status === 'loading') {
    return (
      <div>Loading Component?</div>
    )
  } if (status === "unauthenticated") {
    return (
      <Navigate to="/" replace />
    )
  } if (status === "needs-profile") {
    return (
      <Navigate to="/login" replace />
    )
  }
  return <>{children}</>;
};