//VtoA() mp4 to mp3
//Upscale() mp3 make to bitrate(320k), audiochannel(stereo), (samplerate)Frequency(48000)
//음... 파이썬하고 같이 실행시키는 방향도 괜찮고. 아니면 js로 크롤링하고 다운도 구현해도 되고. 나중에 생각해보자.

const fs = require("fs");
const ffmpeg = require("ffmpeg")

//첫 줄에도 설명되어 있듯이 mp4를 mp3로 변경하면서 파일을 upscaling 해주는 코드
//playlist와 down코드와 합쳐서 사용하면 될듯.
//그리고 모듈 중에서 "youtube-dl-exec": 이거 있는데 이게 다운로드를 해주는 건 아닌데 해당 url파일에 대한 정보를 제공해줘서 같이 쓰면 좋을 것 같아서 일단 uninstall 보류!

const fn = __dirname + "\\" + "의류수거함.mp4";
const tempFn = "./curfile.mp4";
fs.renameSync(fn, tempFn);

const VtoA = (filepath) => {
    try {
        const command = new ffmpeg(filepath);
        // command.setAudioBitRate(320);
        command.then(
            function (video) {
                // Callback mode
                video.fnExtractSoundToMP3(filepath.slice(0, -3) + "mp3", function (error, file) {
                    if (!error) console.log("Audio file: " + file);
                    Upscale(filepath);
                });
            },
            function (err) {
                console.log("Error: " + err);
            }
        );
    } catch (e) {
        console.log(e.code);
        console.log(e.msg);
    }
};

const Upscale = (filepath) => {
    try {
        const mp3 = new ffmpeg(filepath);
        mp3.then(
            (audio) => {
                // console.log(fn.slice(0, -4).replaceAll(" ", ""));
                audio
                    .setAudioBitRate(320)
                    .setAudioChannels(2)
                    .setAudioFrequency(48000)
                    //.setAudioQuality(320)
                    .save(fn.slice(0, -4).replaceAll(" ", "") + ".mp3");
            },
            (err) => {
                console.error(err);
            }
        );
    } catch (e) {
        console.log(e.code);
        console.log(e.msg);
    }
};

VtoA(tempFn);
