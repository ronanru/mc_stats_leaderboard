import clsx from 'clsx';
import Fuze from 'fuse.js';
import {
  createEffect,
  createSignal,
  createUniqueId,
  onCleanup,
  type Component,
} from 'solid-js';

type Item = { value: string; name: string };

const SearchSelect: Component<{
  items: Item[];
  value: string;
  label: string;
  onChange?: (value: string) => void;
}> = props => {
  const [isOpen, setIsOpen] = createSignal(false);
  const [inputValue, setInputValue] = createSignal(
    props.items.find(item => item.value === props.value)?.name || '',
  );
  const [selectedValue, setSelectedValue] = createSignal(props.value);

  const id = createUniqueId();

  const fuseResult = () =>
    new Fuze(props.items, {
      keys: ['name'],
    }).search(inputValue());

  const onWindowClick = (e: MouseEvent) =>
    e.target instanceof HTMLElement &&
    !e.target.closest(`#searchselect-${id}`) &&
    setIsOpen(false);

  window.addEventListener('click', onWindowClick);
  onCleanup(() => window.removeEventListener('click', onWindowClick));

  createEffect(() => {
    setInputValue(
      props.items.find(item => item.value === props.value)?.name || '',
    );
  });

  let ul: HTMLUListElement | undefined;

  const shownItems = () =>
    (fuseResult().length
      ? fuseResult()
      : props.items.map(item => ({ item, score: 0 }))
    )
      .slice(0, 50)
      .map(({ item }) => item);

  const onKeyDown = (e: KeyboardEvent) => {
    if (!['ArrowUp', 'ArrowDown', 'Space', 'Enter'].includes(e.code)) return;
    e.preventDefault();
    switch (e.code) {
      case 'ArrowDown':
      case 'ArrowUp': {
        const newItem = shownItems().at(
          (shownItems().findIndex(({ value }) => value === selectedValue()) +
            (e.code === 'ArrowDown' ? 1 : -1)) %
            shownItems().length,
        );
        if (!newItem) break;
        setSelectedValue(newItem.value);
        Array.from(ul!.children)
          .find(e => (e as HTMLElement).dataset.value === newItem.value)
          ?.scrollIntoView({ block: 'nearest' });
        break;
      }
      case 'Enter':
      case 'Space':
        setValue(selectedValue());
        break;
    }
  };

  const setValue = (value: string) => {
    props.onChange?.(value);
    setSelectedValue(value);
    setIsOpen(false);
  };

  return (
    <div class="relative z-40" id={`searchselect-${id}`} onKeyDown={onKeyDown}>
      <div>
        <label
          class="text-md block font-medium text-gray-300"
          for={`searchselect-input-${id}`}>
          {props.label}
        </label>
        <div class="flex items-center">
          <input
            class="w-full rounded-lg bg-zinc-900 p-2 text-xl"
            type="text"
            role="combobox"
            value={inputValue()}
            aria-expanded={isOpen()}
            aria-controls={isOpen() ? `searchselect-options-${id}` : undefined}
            aria-autocomplete="list"
            onFocus={() => {
              setIsOpen(true);
              setInputValue('');
            }}
            onBlur={() => setIsOpen(false)}
            onInput={e => {
              setInputValue(e.currentTarget.value);
              setIsOpen(true);
            }}
            id={`searchselect-input-${id}`}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="pointer-events-none absolute right-2 h-6 w-6">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
            />
          </svg>
        </div>
      </div>
      {isOpen() && (
        <ul
          ref={ul}
          class="custom-scroll absolute max-h-96 w-full overflow-y-auto rounded-lg border border-zinc-900 bg-zinc-700 shadow-xl"
          id={`searchselect-options-${id}`}
          role="listbox"
          aria-activedescendant={`searchselect-option-${id}-${selectedValue()}`}>
          {shownItems().map(item => (
            <li
              tabIndex={-1}
              role="option"
              aria-selected={item.value === selectedValue()}
              onMouseDown={() => setValue(item.value)}
              onMouseOver={() => setSelectedValue(item.value)}
              data-value={item.value}
              class={clsx([
                'block w-full cursor-pointer p-2 text-left',
                item.value === selectedValue() && 'bg-zinc-800',
              ])}
              id={`searchselect-option-${id}-${item.value}`}>
              {item.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchSelect;
