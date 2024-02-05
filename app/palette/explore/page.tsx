import { getPublicPalettes } from "@/lib/getPublicPalettes";
import InfiniteScroll from "@/app/palette/explore/components/PaginationTrigger";

export default async function Page() {
  const data = await getPublicPalettes(1);

  return (
    <main className="w-full max-w-5xl min-h-screen px-8 py-16 mx-auto bg-main">
      <section>
        <ul className="grid grid-cols-[repeat(auto-fill,_minmax(300px,_1fr))] gap-20">
          {data}
        </ul>
      </section>
      <InfiniteScroll />
    </main>
  );
}
