import type { Component } from 'solid-js';

const ImgBtn: Component = () => {
  return (
    <>
      <button class="btn flex items-center gap-2 bg-zinc-700">
        <img src="/img/Stone.webp" alt="Stone" class="h-6 w-6" />
        Stone
      </button>
    </>
  );
};

export default ImgBtn;
