import type { Component } from 'solid-js';
import stoneImg from '../assets/img/Stone.webp';

const ImgBtn: Component = () => (
  <>
    <button class="btn flex items-center gap-2 bg-zinc-700">
      <img src={stoneImg} alt="" class="h-6 w-6" />
      Stone
    </button>
  </>
);

export default ImgBtn;
