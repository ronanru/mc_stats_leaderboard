import type { Component } from 'solid-js';
import Card from './components/Card';
import ImgBtn from './components/ImgBtn';

const App: Component = () => {
  return (
    <>
      <section class="custom-scroll flex items-center gap-2 overflow-x-auto rounded-xl bg-zinc-800 py-2 px-4">
        <button class="btn bg-zinc-900">Items</button>
        <button class="btn">Mobs</button>
        <button class="btn">General</button>
      </section>
      <section class="space-y-2 rounded-xl bg-zinc-800 p-4">
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
        <div class="custom-scroll flex gap-3 overflow-x-auto text-sm">
          <ImgBtn></ImgBtn>
          <ImgBtn></ImgBtn>
          <ImgBtn></ImgBtn>
          <ImgBtn></ImgBtn>
        </div>
      </section>
      <section class="space-y-2 rounded-xl bg-zinc-800 p-4">
        <ul class="space-y-2">
          <Card></Card>
          <Card></Card>
          <Card></Card>
          <Card></Card>
          <Card></Card>
        </ul>
      </section>
    </>
  );
};

export default App;
