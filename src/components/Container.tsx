import type { ReactNode } from "react";

const Container = ({ children }: { children: ReactNode }) => {
  return (
    <main className="flex flex-col items-center">
      <div className="container relative flex h-screen flex-col items-center gap-3 px-4 py-8">
        {children}
      </div>
    </main>
  );
};

export default Container;
