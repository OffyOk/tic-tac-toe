import Board from "@/components/Board";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center">
      <h1 className="text-4xl mb-2 capitalize">tic-tac-toe game</h1>
      <Board />
    </main>
  );
}
