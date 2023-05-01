const yt = require("yt-converter");

//아직 이 2개의 함수가 정확히 무엇을 하는지는 모름. 아마도 데이터 표현(정보)이나 작업종료 시 실행하는 콜백함수인듯.
const onData = () => {};
const onClose = () => {};

//mp3확장자로 오디오 다운로드
// yt.convertAudio(
//     {
//         url: "https://music.youtube.com/watch?v=W6RvzhJ4dU8&feature=share",
//         itag: 140,
//         directoryDownload: __dirname,
//         title: "Your title here",
//     },
//     onData,
//     onClose
// );

//mp4확장자로 비디오 다운로드
yt.convertVideo(
    {
        url: "https://music.youtube.com/watch?v=W6RvzhJ4dU8&feature=share",
        itag: 136,
        directoryDownload: __dirname,
        title: "Your title here",
    },
    onData,
    onClose
);
