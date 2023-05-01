const ytpl = require("ytpl");

let gPlaylist = undefined;

async function ddd() {
    const playlist = await ytpl("OLAK5uy_nqFrFpN8f5ytzIautSFx11DIpFi4v0pv0");
    // console.log(typeof playlist);
    // console.log(playlist);
    return playlist;
    // gPlaylist = playlist;
}

// https://music.youtube.com/playlist?list=OLAK5uy_nqFrFpN8f5ytzIautSFx11DIpFi4v0pv0&feature=share

const aaa = ddd();

aaa.then((data) => {
    console.log(data);
});

//이 코드는 youtube 플레이리스트를 읽어서 제목,url등을 가진 객체 배열로 저장해주는 코드
