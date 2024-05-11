export default function MainLoader() {
  return (
    <div className="w-full h-[calc(100vh-80px)] bg-main text-secondary">
      <main className="w-full max-w-5xl p-9 mx-auto flex flex-col gap-9">
        <h1 className="text-lg font-semibold text-center">My Collections</h1>
        <div className="w-full grid grid-cols-[repeat(auto-fill,_minmax(300px,_1fr))] gap-16">
          <article className="flex flex-col gap-5">
            <div className="w-full h-36 flex rounded-3xl overflow-hidden bg-gray-600 animate-item-loading"></div>
            <p className="text-transparent">Colors</p>
          </article>

          <article className="flex flex-col gap-5">
            <div className="w-full h-36 flex rounded-3xl overflow-hidden bg-gray-600 animate-item-loading"></div>
            <p className="text-transparent">Gradients</p>
          </article>

          <article className="flex flex-col gap-5">
            <div className="w-full h-36 flex rounded-3xl overflow-hidden bg-gray-600 animate-item-loading"></div>
            <p className="text-transparent">Palettes</p>
          </article>

          <article className="flex flex-col gap-5">
            <div className="w-full h-36 flex rounded-3xl overflow-hidden bg-gray-600 animate-item-loading"></div>
            <p className="text-transparent">Font Icons</p>
          </article>
        </div>
      </main>
    </div>
  );
}
