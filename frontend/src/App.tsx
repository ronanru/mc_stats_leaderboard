import clsx from 'clsx';
import { Component, createEffect, createSignal } from 'solid-js';
import { Stat, getStats } from './api';
import ScrollDetector from './components/ScrollDetector';
import SearchSelect from './components/SearchSelect';
import Select from './components/Select';
import statNames from './statNames';
import { upperCaseFirstLetter } from './utils';

const groups = {
  general: ['custom'],
  items: ['crafted', 'mined', 'picked_up', 'dropped', 'broken', 'used'],
  mobs: ['killed', 'killed_by'],
};

const App: Component = () => {
  const [group, setGroup] =
    createSignal<(typeof groups)[keyof typeof groups][number]>('custom');
  const [page, setPage] = createSignal(0);
  const [stat, setStat] = createSignal<string>(
    Object.keys(statNames.general)[0],
  );
  const [stats, setStats] = createSignal<Stat[]>([]);

  const currentGroup = () =>
    Object.entries(groups).find(([_, g]) =>
      g.includes(group()),
    )![0] as keyof typeof groups;

  createEffect(() => {
    setStat(Object.keys(statNames[currentGroup()])[0]);
  });

  const format = (value: number) => {
    if (stat().endsWith('_cm')) return `${(value / 100000).toFixed(2)}km`;
    if (currentGroup() === 'items' && value > 64)
      return `${(value / 64).toFixed(2)} stacks`;
    if (stat().endsWith('_time') || stat().startsWith('time_')) {
      if (value > 1728000) return `${(value / 1728000).toFixed(2)} days`;
      if (value > 72000) return `${(value / 72000).toFixed(2)} hours`;
      if (value > 1200) return `${(value / 1200).toFixed(2)} minutes`;
      return `${value.toFixed(2)} seconds`;
    }
    return value.toString();
  };

  createEffect(() => {
    getStats({
      group: `minecraft:${group()}`,
      stat: `minecraft:${stat()}`,
      page: 0,
    }).then(stats => {
      setPage(stats.length ? 0 : -1);
      setStats(stats);
    });
  });

  const loadMore = () => {
    if (page() === -1) return;
    getStats({
      group: `minecraft:${group()}`,
      stat: `minecraft:${stat()}`,
      page: page() + 1,
    }).then(newStats => {
      setPage(newStats.length ? page() + 1 : -1);
      setStats([...stats(), ...newStats]);
    });
  };

  return (
    <>
      <section
        role="tablist"
        class="custom-scroll grid grid-cols-3 items-center gap-2 overflow-x-auto rounded-xl bg-zinc-800 px-4 py-2 sm:flex">
        {(Object.keys(groups) as (keyof typeof groups)[]).map(g => (
          <button
            role="tab"
            class={clsx(['btn', groups[g].includes(group()) && 'bg-zinc-900'])}
            onClick={() => setGroup(groups[g][0])}>
            {upperCaseFirstLetter(g)}
          </button>
        ))}
      </section>
      <section class="grid grid-cols-[repeat(auto-fit,_minmax(0px,_1fr))] gap-2 rounded-xl bg-zinc-800 p-4">
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
            }),
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
                  src={`https://visage.surgeplay.com/face/32/${player.uuid}`}
                  alt=""
                  width={32}
                  height={32}
                  class="rounded-md"
                  loading="lazy"
                />
                {player.nickname}
              </div>
              <span class="proportional-nums">{format(value)}</span>
            </div>
          ))}
          {page() !== -1 && <ScrollDetector onScroll={loadMore} />}
        </div>
      </section>
    </>
  );
};

export default App;
