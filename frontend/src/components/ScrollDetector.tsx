import { Component, onCleanup } from 'solid-js';

const ScrollDetector: Component<{
  onScroll: () => void;
}> = props => {
  const observer = new IntersectionObserver(
    ([entry]) => entry.isIntersecting && props.onScroll(),
  );

  onCleanup(() => observer.disconnect());

  return <div ref={el => observer.observe(el)} />;
};

export default ScrollDetector;
