import InfiniteScroll from "./components/InfiniteScroll";

export default async function Page() {
  return (
    <div className="w-full h-auto bg-main">
      <main className="w-full max-w-5xl min-h-screen px-8 py-16 mx-auto">
        <InfiniteScroll />
      </main>
    </div>
  );
}
