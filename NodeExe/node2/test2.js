//Event 사용하기
//EventEmitter: 이벤트를 주고 받음
//process: 내부적으로 EventEmitter를 상속 받아있음
//on(): 실행할 이벤트
//emit(): 이벤트(on) 호출


//exit는 내장 이벤트, 이름은 불변
//process가 종료하면 자동으로 exit 이벤트를 호출


process.on('exit', () => {
  console.log('exit 이벤트 발생함');
});

setTimeout(() => {
  console.log('4초후에 시스템 종료함');
  process.exit(); //그렇다면 사용자가 직접 만드는 것도 가능한가?

}, 1000);


process.on('tick', (count) => {
  console.log('tick 이벤트 발생: ' + count);
});

setTimeout(() => {
  console.log('2초 후에 tick 이벤트 호출함');
  process.emit('exit');
}, 2000);