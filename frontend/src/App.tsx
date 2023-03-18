import clsx from 'clsx';
import { Component, createSignal } from 'solid-js';
import { Stat } from './api';
import Card from './components/Card';
import Select from './components/Select';
import { upperCaseFirstLetter } from './utils';

const App: Component = () => {
  const groups = ['general', 'items', 'mobs'];
  const [group, setGroup] = createSignal<(typeof groups)[number]>(groups[0]);
  const [stats, setStats] = createSignal<Stat[]>([]);

  return (
    <>
      <section class="custom-scroll grid grid-cols-3 items-center gap-2 overflow-x-auto rounded-xl bg-zinc-800 py-2 px-4 sm:flex">
        {groups.map(g => (
          <button
            class={clsx(['btn', group() === g && 'bg-zinc-900'])}
            onClick={() => setGroup(g)}>
            {upperCaseFirstLetter(g)}
          </button>
        ))}
      </section>
      <section class="space-y-2 rounded-xl bg-zinc-800 p-4">
        <Select></Select>
        <Select></Select>
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
