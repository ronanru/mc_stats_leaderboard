import type { Component } from 'solid-js';
import Card from './components/Card';
import Header from './components/Header';
import ImgBtn from './components/ImgBtn';

const App: Component = () => {
  return (
    <>
      <Header></Header>
      <section class="container mx-auto mt-4 space-y-4 px-2">
        <div class="custom-scroll flex items-center gap-2 overflow-x-auto rounded-xl bg-zinc-800 py-2 px-4">
          <button class="btn bg-zinc-900">Items</button>
          <button class="btn">Mobs</button>
          <button class="btn">General</button>
        </div>
        <div class="space-y-2 rounded-xl bg-zinc-800 p-4">
          <form class="items-center gap-4 space-y-4 md:flex md:space-y-0 ">
            <input
              id="Input"
              type="text"
              class="h-10 w-full rounded-lg bg-zinc-900 p-1.5 text-xl text-white"
              name=""
              placeholder="Block id"
            />
            <select class="h-10 w-full rounded-lg bg-zinc-900 p-1.5 text-xl text-white">
              <option>Lorem, ipsum.</option>
              <option>Lorem, ipsum dolor.</option>
            </select>
          </form>
          <ul class="custom-scroll flex gap-3 overflow-x-auto text-sm">
            <li>
              <ImgBtn></ImgBtn>
            </li>
            <li>
              <ImgBtn></ImgBtn>
            </li>
            <li>
              <ImgBtn></ImgBtn>
            </li>
            <li>
              <ImgBtn></ImgBtn>
            </li>
          </ul>
        </div>
        <div class="space-y-2 rounded-xl bg-zinc-800 p-4">
          <ul class="space-y-2">
            <Card></Card>
            <Card></Card>
            <Card></Card>
            <Card></Card>
            <Card></Card>
          </ul>
        </div>
      </section>
    </>
  );
};

export default App;

{
  /* <img
                    src="https://visage.surgeplay.com/face/12/4658c32b0e9e4070949cb454aad5b43f"
                    alt="RonanRU"
                    class="rounded-md"
                  />
                  RonanRU */
}
