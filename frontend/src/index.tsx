/* @refresh reload */
import { render } from 'solid-js/web';
import App from './App';
import './index.css';

const main = document.querySelector('main');

render(() => <App />, main!);
