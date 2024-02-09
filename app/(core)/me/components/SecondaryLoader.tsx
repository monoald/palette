export default function SecondaryLoader() {
  return (
    <div className="w-full h-[calc(100vh-80px)] bg-main text-secondary">
      <main className="w-full max-w-5xl p-9 mx-auto flex flex-col gap-20">
        <h1 className="text-lg font-semibold text-center text-transparent">
          My
        </h1>
        <div className="w-full grid grid-cols-[repeat(auto-fill,_minmax(300px,_1fr))] gap-20">
          <article className="flex flex-col gap-5">
            <div className="w-full h-36 rounded-3xl bg-gray-600 animate-item-loading"></div>

            <div className="px-5 py-2 mx-auto border border-primary-border rounded-full flex items-center gap-7 text-2xl text-transparent animate-item-loading">
              <button className="secondary-hover flex">
                <span className="icon-heart" />
              </button>
              <button className="secondary-hover flex">
                <span className="icon-heart" />
              </button>
            </div>
          </article>

          <article className="flex flex-col gap-5">
            <div className="w-full h-36 rounded-3xl bg-gray-600 animate-item-loading"></div>

            <div className="px-5 py-2 mx-auto border border-primary-border rounded-full flex items-center gap-7 text-2xl text-transparent animate-item-loading">
              <button className="secondary-hover flex">
                <span className="icon-heart" />
              </button>
              <button className="secondary-hover flex">
                <span className="icon-heart" />
              </button>
            </div>
          </article>

          <article className="flex flex-col gap-5">
            <div className="w-full h-36 rounded-3xl bg-gray-600 animate-item-loading"></div>

            <div className="px-5 py-2 mx-auto border border-primary-border rounded-full flex items-center gap-7 text-2xl text-transparent animate-item-loading">
              <button className="secondary-hover flex">
                <span className="icon-heart" />
              </button>
              <button className="secondary-hover flex">
                <span className="icon-heart" />
              </button>
            </div>
          </article>

          <article className="flex flex-col gap-5">
            <div className="w-full h-36 rounded-3xl bg-gray-600 animate-item-loading"></div>

            <div className="px-5 py-2 mx-auto border border-primary-border rounded-full flex items-center gap-7 text-2xl text-transparent animate-item-loading">
              <button className="secondary-hover flex">
                <span className="icon-heart" />
              </button>
              <button className="secondary-hover flex">
                <span className="icon-heart" />
              </button>
            </div>
          </article>
        </div>
      </main>
    </div>
  );
}
