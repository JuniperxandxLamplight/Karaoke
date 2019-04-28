const songList = {
  1: "Just before our love was lost, You said 'I am as constant as a Northern Star', And I said: 'Constantly in the darkness? Where's that at? If you want me I'll be in the bar.', On the back of a cartoon coaster, In the blue TV screen light, I drew a map of Canada, Oh Canada. Mm, With your face sketched on it twice, Oh you're in my blood like holy wine, It tastes so bitter, Bitter and so sweet, Oh I could drink a case of you darlin', And I would still be on my feet, I would still be on my feet.".split(', '),
  2: "Sunday is gloomy, The hours are slumberless, Dearest the shadows I live with are numberless, Little white flowers, Will never awaken you, Not where the black coach, Of sorror has taken you, Angels have no thought, Of ever returning you, Would they be angry, If I thought of joining you, Gloomy Sunday.".split(', ')
}

const initialState = {
  currentSongId: null,
  songsById: {
    1: {
      title: "Case of You",
      artist: "Joni Mitchell",
      songId: 1,
      songArray: songList[1],
      arrayPosition: 0
    },
    2: {
      title: "Gloomy Sunday",
      artist: "Various",
      songId: 2,
      songArray: songList[2],
      arrayPosition: 0
    }
  }
}

const lyricChangeReducer = (state = initialState.songsById, action) => {
  let newArrayPosition;
  let newSongsByIdEntry;
  let newSongsByIdStateSlice;
  switch (action.type) {
    case 'NEXT_LYRIC':
      newArrayPosition = state[action.currentSongId].arrayPosition + 1;
      newSongsByIdEntry = Object.assign({}, state[action.currentSongId], {
        arrayPosition: newArrayPosition
      })
      newSongsByIdStateSlice = Object.assign({}, state, {
        [action.currentSongId]: newSongsByIdEntry
      });
      return newSongsByIdStateSlice;
    case 'RESTART_SONG':
      newSongsByIdEntry = Object.assign({}, state[action.currentSongId], {
        arrayPosition: 0
      })
      newSongsByIdStateSlice = Object.assign({}, state, {
        [action.currentSongId]: newSongsByIdEntry
      });
      return newSongsByIdStateSlice;
    default:
      return state;
  }
}

const songChangeReducer = (state = initialState.currentSongId, action) => {
  switch (action.type){
    case 'CHANGE_SONG':
      return action.newSelectedSongId;
    default:
      return state;
  }
}

const rootReducer = this.Redux.combineReducers({
  currentSongId: songChangeReducer,
  songsById: lyricChangeReducer
})


const {createStore} = Redux;
const store = createStore(rootReducer);
console.log(store.getState());


const {expect} = window;

expect(lyricChangeReducer(initialState.songsById, {type: null})).toEqual(initialState.songsById);

expect(lyricChangeReducer(initialState.songsById, {type: 'NEXT_LYRIC', currentSongId: 2})).toEqual({
  1: {
    title: "Case of You",
    artist: "Joni Mitchell",
    songId: 1,
    songArray: songList[1],
    arrayPosition: 0
  },
  2: {
    title: "Gloomy Sunday",
    artist: "Various",
    songId: 2,
    songArray: songList[2],
    arrayPosition: 1
  }
});

expect(lyricChangeReducer(initialState.songsById,
  { type: 'RESTART_SONG', currentSongId: 1 }
)).toEqual({  1: {
    title: "Case of You",
    artist: "Joni Mitchell",
    songId: 1,
    songArray: songList[1],
    arrayPosition: 0
  },
  2: {
    title: "Gloomy Sunday",
    artist: "Various",
    songId: 2,
    songArray: songList[2],
    arrayPosition: 0
  }
});


expect(songChangeReducer(initialState, {type: null})).toEqual(initialState);

expect(songChangeReducer(initialState.currentSongId, {type: 'CHANGE_SONG', newSelectedSongId: 1})).toEqual(1);

expect(rootReducer(initialState, {type: null})).toEqual(initialState);

expect(store.getState().currentSongId).toEqual(songChangeReducer(undefined, {type: null}));

expect(store.getState().songsById).toEqual(lyricChangeReducer(undefined, {type: null}));





const renderLyrics = () => {
  const lyricsDisplay = document.getElementById('lyrics');
  while (lyricsDisplay.firstChild) {
    lyricsDisplay.removeChild(lyricsDisplay.firstChild);
  }

  if (store.getState().currentSongId) {
    const currentLine = document.createTextNode(store.getState().songsById[store.getState().currentSongId].songArray[store.getState().songsById[store.getState().currentSongId].arrayPosition]);
    document.getElementById('lyrics').appendChild(currentLine);
  } else {
    const selectSongMessage = document.createTextNode("Select a song from the menu above to sing along!");
    document.getElementById('lyrics').appendChild(selectSongMessage);
  }
}

const renderSongs = () => {
  const songsById = store.getState().songsById;
  for (const songKey in songsById) {
    const song = songsById[songKey]
    const li = document.createElement('li');
    const h3 = document.createElement('h3');
    const em = document.createElement('em');
    const songTitle = document.createTextNode(song.title);
    const songArtist = document.createTextNode(' by ' + song.artist);
    em.appendChild(songTitle);
    h3.appendChild(em);
    h3.appendChild(songArtist);
    h3.addEventListener('click', function() {
      selectSong(song.songId);
    });
    li.appendChild(h3);
    document.getElementById('songs').appendChild(li);
  }
}

window.onload = function(){
  renderSongs();
  renderLyrics();
}

const userClick = () => {
  if (store.getState().songsById[store.getState().currentSongId].arrayPosition === store.getState().songsById[store.getState().currentSongId].songArray.length - 1) {
    store.dispatch({ type: 'RESTART_SONG',
      currentSongId: store.getState().currentSongId });
  } else {
    store.dispatch({ type: 'NEXT_LYRIC',
      currentSongId: store.getState().currentSongId });
  }
}

const selectSong = (newSongId) => {
  let action;
  if (store.getState().currentSongId){
    action = {
      type: 'RESTART_SONG',
      currentSongId: store.getState().currentSongId
    }
    store.dispatch(action);
  }
  action = {
    type: 'CHANGE_SONG',
    newSelectedSongId: newSongId
  }
  store.dispatch(action);
}

store.subscribe(renderLyrics);
