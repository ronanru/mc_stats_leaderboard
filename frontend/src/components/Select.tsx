import clsx from 'clsx';
import {
  createSignal,
  createUniqueId,
  onCleanup,
  type Component,
} from 'solid-js';

type Item = { value: string; name: string };

const Select: Component<{
  items: Item[];
  value: string;
  label: string;
  onChange?: (value: string) => void;
}> = props => {
  const [isOpen, setIsOpen] = createSignal(false);
  const [selectedValue, setSelectedValue] = createSignal(props.value);

  const id = createUniqueId();

  const onWindowClick = (e: MouseEvent) =>
    e.target instanceof HTMLElement &&
    !e.target.closest(`#select-${id}`) &&
    setIsOpen(false);

  window.addEventListener('click', onWindowClick);
  onCleanup(() => window.removeEventListener('click', onWindowClick));

  const setValue = (value: string) => {
    props.onChange?.(value);
    setSelectedValue(value);
    setIsOpen(false);
  };

  let ul: HTMLUListElement | undefined;

  const onKeyDown = (e: KeyboardEvent) => {
    if (
      !['ArrowUp', 'ArrowDown', 'KeyJ', 'KeyK', 'Space', 'Enter'].includes(
        e.code
      )
    )
      return;
    e.preventDefault();
    switch (e.code) {
      case 'ArrowDown':
      case 'ArrowUp':
      case 'KeyJ':
      case 'KeyK': {
        const newItem = props.items.at(
          (props.items.findIndex(({ value }) => value === selectedValue()) +
            (['ArrowDown', 'KeyJ'].includes(e.code) ? 1 : -1)) %
            props.items.length
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

  return (
    <div class="relative" id={`select-${id}`} onKeyDown={onKeyDown}>
      <div class="bg-zinc-900 p-4">
        <label
          class="block text-sm font-medium text-gray-300"
          for={`select-button-${id}`}>
          {props.label}
        </label>
        <button
          class="bg-transparent"
          type="button"
          role="combobox"
          aria-expanded={isOpen()}
          aria-haspopup="true"
          aria-controls={isOpen() ? `select-options-${id}` : undefined}
          onClick={() => setIsOpen(!isOpen())}
          id={`select-button-${id}`}>
          {props.items.find(item => item.value === props.value)?.name}
        </button>
      </div>
      {isOpen() && (
        <ul
          ref={ul}
          class="absolute w-full bg-zinc-900"
          id={`select-options-${id}`}
          role="listbox"
          aria-activedescendant={`select-option-${id}-${selectedValue()}`}>
          {props.items.map(item => (
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
              id={`select-option-${id}-${item.value}`}>
              {item.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Select;
