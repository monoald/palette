import InfiniteScroll from "./components/InfiniteScroll";
import { getPublicPalettes } from "./components/getPublicPalettes";

export default async function Page() {
  const data = await getPublicPalettes(1);

  return (
    <div className="w-full h-auto bg-main">
      <main className="w-full max-w-5xl min-h-screen px-8 py-16 mx-auto">
        <section>
          <ul className="grid grid-cols-[repeat(auto-fill,_minmax(300px,_1fr))] gap-20">
            {data}
          </ul>
        </section>
        <InfiniteScroll />
      </main>
    </div>
  );
}
