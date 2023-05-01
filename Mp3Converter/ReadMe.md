# Youtube Music Downloader and Convert, Upscale
## 유튜브 뮤직 곡이나 플레이리스트 url을 이용해서 음악을 다운받고 mp3파일로 변경과 320kbps등 Upscale을 하는 프로그램
- 간단하게 설명하자면 노래를 검색, 내려받기, 변환, 음질Upscale 등 여러가지 기능이 필요해서 개발 시작하게 된 프로그램.
- 내려받기, 변환, 음질Upscale은 사실 아주 간단하다. 그냥 파일이나 정확한 url만 존재하면 되기 때문이다.
- 어려울 것으로 예상되는 것은 검색 부분이 아주아주 어려울 것으로 예상된다.
- 이유는 검색은 내가 적어둔 이러한 형식 "아이유 - unlucky" 이렇게 "가수 - 제목" 형태로 검색을 할텐데 아마도 제대로 나오지 않는 곡들도 많을 것이고
- 이 검색해서 노래 파일을 다운로드 하는 것에 더해서 2가지가 더 필요하다. 앨범커버와 가사도 같이 내려받아야 하기 때문이다.
- 앨범커버야 해상도만 적당하면 어떤 사이트 것을 써도 무방하지만 가사는 내가 작업하는 기준에 최대한 맞는(보통 4줄 기준)가사를 youtube music, melon, bugs, genie, 구글 검색 등등으로 찾아서 알맞은 것을 내려받아야 하기 때문이다.
- 그리고 아마 검색해도 나오지 않는 곡들도 있을테니 그것들은 내가 수동으로 작업을 하거나 해야한다.
- 일단 최초 생각한 내용은 이러한 것들이다. 잘 구현해보자.
- 그 전에 설계를 잘해보자!!!

<hr>
<br><br>

## Build Environment
build version: nodejs v16.16.0
dependency: ffmpeg, youtube-dl-exec, yt-converter, ytpl

## Run Environment
OS: window 10

## Version History
### v.2023MMDD
