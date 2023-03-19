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
    props.items.find(item => item.value === props.value)?.name || ''
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
      props.items.find(item => item.value === props.value)?.name || ''
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
            shownItems().length
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
    <div class="relative" id={`searchselect-${id}`} onKeyDown={onKeyDown}>
      <div class="bg-zinc-900 p-4">
        <label
          class="block text-sm font-medium text-gray-300"
          for={`searchselect-input-${id}`}>
          {props.label}
        </label>
        <input
          class="bg-transparent"
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
      </div>
      {isOpen() && (
        <ul
          ref={ul}
          class="absolute w-full bg-zinc-900"
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
                'block w-full cursor-pointer p-4 text-left',
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
