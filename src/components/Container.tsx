import type { ReactNode } from "react";

const Container = ({ children }: { children: ReactNode }) => {
  return (
    <main className="flex flex-col items-center">
      <div className="container relative flex min-h-screen flex-col items-center px-4 py-16">
        {children}
      </div>
    </main>
  );
};

export default Container;
