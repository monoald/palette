import { fetchPublicPalettes } from "@/app/action";
import PaginationTrigger from "@/app/palette/explore/components/PaginationTrigger";
import Card from "./components/Card";

export default async function Page() {
  // const [page, setPage] = useState(1);
  const data = await fetchPublicPalettes(1);

  return (
    <main className="w-full max-w-5xl min-h-screen px-8 py-16 mx-auto">
      <section>
        <ul className="grid grid-cols-[repeat(auto-fill,_minmax(300px,_1fr))] gap-20">
          {data}

          {/* <span ref={ref} className='pagination-trigger'/> */}
        </ul>
      </section>
      <PaginationTrigger />
    </main>
  );
}
