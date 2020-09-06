const tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
const firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

const socket = io();
const urlParams = new URLSearchParams(location.search);

const playStopIcon = document.querySelector('.play-stop-icon');
const youtubeURL = document.querySelector('#url');

const username = urlParams.get('username');
const room = urlParams.get('room');
socket.emit('joinRoom', {username, room});

let player;
function onYouTubeIframeAPIReady(){
  player = new YT.Player('player', {
    height: '390',
    width: '640',
    videoId: 'ScMzIvxBSi4'
  });
}

function getIdFromURL(URL){
  return URL.split('?v=')[1].split('&')[0];
}

function loadNewVideo(){
  if(youtubeURL.value === ''){
    return;
  }
  socket.emit('change', getIdFromURL(youtubeURL.value));
}

function syncVideoTimePress(){
  const duration = player.getDuration();
  const currentTime = player.getCurrentTime();
  socket.emit('sync', currentTime);
}

function playButtonPress(){
  if(playStopIcon.innerHTML === 'play_arrow'){
    playStopIcon.innerHTML = 'stop';
    socket.emit('playing');
  }
  else{
    playStopIcon.innerHTML = 'play_arrow';
    socket.emit('paused');
  }
}

socket.on('message', (message) => {
  M.toast({html: message});
});

socket.on('playVideo', () => {
  player.playVideo();
  playStopIcon.innerHTML = 'stop';
  M.toast({html: 'Playing video'});
});

socket.on('pauseVideo', () => {
  player.pauseVideo();
  playStopIcon.innerHTML = 'play_arrow';
  M.toast({html: 'Pausing video'});
});

socket.on('syncVideo', (time) => {
  player.seekTo(time);
  M.toast({html: 'Synchronizing video'});
});

socket.on('changeVideo', (videoId) => {
  player.loadVideoById(videoId);
  M.toast({html: 'New video playing'});
});