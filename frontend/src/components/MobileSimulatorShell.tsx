import React from 'react';

interface MobileSimulatorShellProps {
  children: React.ReactNode;
}

export const MobileSimulatorShell: React.FC<MobileSimulatorShellProps> = ({ children }) => {
  return <>{children}</>;
};
