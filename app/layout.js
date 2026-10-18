import "./globals.css";

export const metadata = {
  title: "AVL Tree Visualizer | Interactive DSA Learning Platform",
  description: "Modern, interactive AVL Tree Visualizer featuring step-by-step rotations (LL, RR, LR, RL), height and balance factor tracking, traversals, and playback controls.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-indigo-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
