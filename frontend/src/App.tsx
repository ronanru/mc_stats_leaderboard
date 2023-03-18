import clsx from 'clsx';
import { Component, createEffect, createSignal } from 'solid-js';
import { getStats, Stat } from './api';
import Select from './components/Select';
import statNames from './statNames';
import { upperCaseFirstLetter } from './utils';

const groups = {
  general: ['custom'],
  items: ['crafted', 'mined', 'picked_up', 'dropped', 'broken', 'used'],
  mobs: ['killed', 'killed_by'],
} as Record<string, string[]>;

const App: Component = () => {
  const [group, setGroup] = createSignal<string>('custom');
  const [page, setPage] = createSignal(0);
  const [stat, setStat] = createSignal<string>(
    Object.keys(statNames.general)[0]
  );
  const [stats, setStats] = createSignal<Stat[]>([]);

  createEffect(() => {
    const g = Object.entries(groups).find(([_, g]) => g.includes(group()))![0];
    setStat(Object.keys(statNames[g])[0]);
  });

  createEffect(() => {
    getStats({
      group: group(),
      stat: stat(),
      page: page(),
    }).then(setStats);
  });

  return (
    <>
      <pre>
        {JSON.stringify(
          Object.entries(groups)
            .find(([_, g]) => g.includes(group()))![1]
            .map(id => ({
              value: id,
              name: upperCaseFirstLetter(id),
            })),
          null,
          2
        )}
      </pre>
      <section class="custom-scroll grid grid-cols-3 items-center gap-2 overflow-x-auto rounded-xl bg-zinc-800 py-2 px-4 sm:flex">
        {Object.keys(groups).map(g => (
          <button
            class={clsx(['btn', groups[g].includes(group()) && 'bg-zinc-900'])}
            onClick={() => setGroup(groups[g][0])}>
            {upperCaseFirstLetter(g)}
          </button>
        ))}
      </section>
      <section class="grid grid-cols-2 gap-2 rounded-xl bg-zinc-800 p-4">
        <Select
          items={Object.entries(groups)
            .find(([_, g]) => g.includes(group()))![1]
            .map(id => ({
              value: id,
              name: upperCaseFirstLetter(id),
            }))}
          value={group()}
          onChange={setGroup}
        />
        {/* <Select></Select> */}
      </section>
      <section class="space-y-2 rounded-xl bg-zinc-800 p-4">
        <div class="space-y-2">
          {stats.length === 0 && <p>No data found.</p>}
          {stats().map(({ player, value }) => (
            <div class="flex items-center justify-between rounded-lg bg-zinc-900 p-2">
              <div class="flex items-center gap-2">
                <p class="text-xl font-bold">#1</p>
                <img
                  src={`https://visage.surgeplay.com/face/12/${player.uuid}`}
                  alt=""
                  class="rounded-md"
                  loading="lazy"
                />
                {player.nickname}
              </div>
              {value}
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default App;
