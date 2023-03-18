import type { Component } from 'solid-js';

const Card: Component = () => (
  <>
    <li class="flex items-center justify-between rounded-lg bg-zinc-900 p-2">
      <div class="flex items-center gap-2">
        <p class="text-xl font-bold">#1</p>
        <img
          src="https://visage.surgeplay.com/face/12/4658c32b0e9e4070949cb454aad5b43f"
          alt="RonanRU"
          class="rounded-md"
        />
        RonanRU
      </div>
      342 stacks
    </li>
  </>
);

export default Card;
