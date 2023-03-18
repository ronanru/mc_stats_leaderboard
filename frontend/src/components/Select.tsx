import { createOptions, createSelect } from '@thisbeyond/solid-select';
import { createEffect, type Component } from 'solid-js';

type Item = { value: string; name: string };

const Select: Component<{
  items: Item[];
  value: string;
  onChange?: (value: string) => void;
}> = ({ items, onChange }) => {
  const options = createOptions(items);
  const select = createSelect({
    ...options,
    onChange: ({ value }: Item) => onChange && onChange(value),
  });

  createEffect(() => {
    console.log(items);
  });

  return (
    <div ref={select.containerRef} class="relative max-w-md">
      <div class="grid h-10 w-full grid-cols-1 rounded-lg bg-zinc-900 p-1.5 text-xl text-white">
        {select.hasValue && !select.inputValue && (
          <div class="[grid-row-start:1] [grid-col-start:1]">
            {options.format(select.value, 'value').name}
          </div>
        )}
        <input
          type="text"
          value={select.inputValue}
          ref={select.inputRef}
          class="bg-transparent outline-none [grid-row-start:1] [grid-col-start:1]"
        />
      </div>
      {select.isOpen && (
        <div ref={select.listRef} class="absolute">
          {select.options.map((option: string) => (
            <button
              class="flex items-center justify-between rounded-lg bg-zinc-900 p-2"
              onClick={() => select.pickOption(option)}>
              {options.format(option, 'option').name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Select;
