// app/page.tsx
import Image from "next/image";

export default function Home() {
  return (
    <main className="p-6">
      <h1>Hello World 👋</h1>
      <p>Welcome to my first Next.js page!</p>
      <Image src="/next.svg" alt="Next.js" width={150} height={80} />
    </main>
  );
}
