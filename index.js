import makeStore from './src/store';
import startServer from './src/server';

function chooseRandom(entries, number){
  return entries.sort(() => 0.5 - Math.random()).slice(0, number);
}

export const store = makeStore();
startServer(store);

store.dispatch({
  type: 'SET_ENTRIES',
  entries: chooseRandom(require('./entries.json'), 2)
});
store.dispatch({type: 'NEXT'});
