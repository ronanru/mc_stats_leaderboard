import clsx from 'clsx';
import { Component, createEffect, createSignal } from 'solid-js';
import { getStats, Stat } from './api';
import SearchSelect from './components/SearchSelect';
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
  // const [page, setPage] = createSignal(0);
  const [stat, setStat] = createSignal<string>(
    Object.keys(statNames.general)[0]
  );
  const [stats, setStats] = createSignal<Stat[]>([]);

  const currentGroup = () =>
    Object.entries(groups).find(([_, g]) => g.includes(group()))![0];

  createEffect(() => {
    setStat(Object.keys(statNames[currentGroup()])[0]);
  });

  createEffect(() => {
    getStats({
      group: `minecraft:${group()}`,
      stat: `minecraft:${stat()}`,
      page: 0,
    }).then(setStats);
  });

  return (
    <>
      <section class="custom-scroll grid grid-cols-3 items-center gap-2 overflow-x-auto rounded-xl bg-zinc-800 py-2 px-4 sm:flex">
        {Object.keys(groups).map(g => (
          <button
            class={clsx(['btn', groups[g].includes(group()) && 'bg-zinc-900'])}
            onClick={() => setGroup(groups[g][0])}>
            {upperCaseFirstLetter(g)}
          </button>
        ))}
      </section>
      <section class="grid gap-2 rounded-xl bg-zinc-800 p-4">
        {groups[currentGroup()].length > 1 && (
          <Select
            label="Group"
            items={groups[currentGroup()].map(id => ({
              value: id,
              name: upperCaseFirstLetter(id),
            }))}
            value={group()}
            onChange={setGroup}
          />
        )}
        <SearchSelect
          label="Stat"
          value={stat()}
          onChange={setStat}
          items={Object.entries(statNames[currentGroup()]).map(
            ([value, name]) => ({
              value,
              name,
            })
          )}
        />
      </section>
      <section class="space-y-2 rounded-xl bg-zinc-800 p-4" role="table">
        <div class="space-y-2">
          {stats().length === 0 && <p>No data found.</p>}
          {stats().map(({ player, value }, i) => (
            <div
              class="flex items-center justify-between rounded-lg bg-zinc-900 p-2"
              role="row">
              <div class="flex items-center gap-2">
                <p class="text-xl font-bold">#{i + 1}</p>
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
