'use strict'

//url 모듈 사용하기

let url = require('url');

//parse : 주소 문자열을 URL 객체로 변환

let curUrl = url.parse('https://m.search.naver.com/search.naver?sm=mtb_hty.top&where=m&oquery=Angelina+Danilova&tqi=hyskfwqVWeKssNCahRdssssssrd-472274&query=Angelina+Danilova');

//format : URL 객체를 주소 문자열로 변환
let curStr = url.format(curUrl);

console.log(curStr);
console.dir(curUrl);

let queryStr = require('querystring')

let param = queryStr.parse(curUrl.query);

console.log(param.query);
//stringify : 객체를 문자열로 변환
console.log(queryStr.stringify(param));
