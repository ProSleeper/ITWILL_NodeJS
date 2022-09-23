
//게시판을 위한 라우팅 함수 정의

//HTML 공통 문자 
//showBoard.ejs에서 사용
//var Entities = require('html-entities').AllHtmlEntities;

var moment = require('moment');

var addBoard = function(req, res) {
	
	console.log('addBoard 호출됨.');
 
    var title = req.body.title;
    var contents = req.body.contents;
    var writer = req.body.writer;	
    
	var database = req.app.get('database');
	
	// 데이터베이스 객체가 초기화된 경우
	if (database) {
		
		// 1. 이메일 이용해 사용자 검색(user4 컬렉션에서 검색)
		database.UserModel.findByEmail(writer, function(err, result) {
			
			if (err) { 
                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
				res.write('<h2>게시판 글 추가 중 에러 발생</h2>');
                res.write('<p>' + err.stack + '</p>');
				res.end();
                
                return;
            }

			if (result == undefined || result.length < 1) {
				res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
				res.write('<h2>사용자 [' + writer + ']를 찾을 수 없습니다.</h2>');
				res.end();
				
				return;
			}
			
			var userObjectId = result[0]._doc._id;
			console.log('사용자 ObjectId : ' + writer +' -> ' + userObjectId);
						
			
			// save()로 저장
			// BoardModel 인스턴스 생성
			var board = new database.BoardModel({
				title: title,
				contents: contents,
				writer: userObjectId
			});

			board.saveBoard(function(err, result) {
				
				if (err) {

                   res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                   res.write('<h2>응답 웹문서 생성 중 에러 발생</h2>');
                  
                   res.end();

                   return;
                    
                }
							    
			    console.log('게시글 데이터 추가. : ' + board._id);
			    
			    //redirect할때 showBoard.ejs에서 css를 읽지 못함
			    //showBoard.ejs의 head안에 <base href="/" /> 추가
			    return res.redirect('/process/showboard/' + board._id); 
			    
			});
			
		});
		
	} else {
		res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
		res.write('<h2>데이터베이스 연결 실패</h2>');
		res.end();
	}
	
};


var showBoard = function(req, res) {
	
	console.log('showBoard 호출.');
  
	//반드시 params으로 받을것
	var id = req.params.id;       
    
	var database = req.app.get('database');
	
    // 데이터베이스 객체가 초기화된 경우
	if (database) {
		
		// 1. 글 리스트
		database.BoardModel.load(id, function(err, result) {
			
			if (err) {
                
                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
				res.write('<h2>게시판 글 조회 중 에러 발생</h2>');               
				res.end();
                
                return;
            }
			
			if (result) {  
				
				// 조회수 업데이트
                database.BoardModel.updateHitCount(result._doc._id, function(err2, result2) {
                                       
                    if (err2) {
                        console.log('updateHitCount 실행 중 에러 발생.');
                        console.dir(err2);
                        return;
                    }
                    
                });
				
				
				res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
				
				// 뷰 템플레이트를 이용하여 렌더링한 후 전송
				var context = {
					title: '게시글 보기',
					result: result
				};
				
				req.app.render('showBoard', context, function(err, html) {
					
					if (err) {
                       
                        res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                        res.write('<h2>응답 웹문서 생성 중 에러 발생</h2>');                        
                        res.end();

                        return;
                    }					
					
					res.end(html);
				});
			 
			} else {
				res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
				res.write('<h2>글 조회  실패</h2>');
				res.end();
			}
		});
	} else {
		res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
		res.write('<h2>데이터베이스 연결 실패</h2>');
		res.end();
	}
	
};



var listBoard = function(req, res) {
	
	console.log('listBoard 호출.');
  
    var page = req.param("page");
    var perPage = req.param("perPage");
    
	var database = req.app.get('database');
	
    // 데이터베이스 객체가 초기화된 경우
	if (database) {
		
		// 1. 글 리스트
		var option = {
			page: page,
			perPage: perPage
		}
		
		database.BoardModel.list(option, function(err, result) {
			
			if (err) {
                
                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
				res.write('<h2>게시판 글 목록 조회 중 에러 발생</h2>');               
				res.end();
                
                return;
            }
			
			if (result) {				
 
				// 전체 문서 객체 수 확인
				database.BoardModel.count().exec(function(err, count) {

					res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
					
					// 뷰 템플레이트를 이용하여 렌더링한 후 전송
					var context = {
							
						title: '게시판 리스트',
						result: result,
						page: parseInt(page),
						pageCount: Math.ceil(count / perPage),//페이지갯수
						perPage: perPage, //한페이지당 데이터 표시 갯수
						totalRecords: count,
						size: perPage,
						moment:moment
						
					};
					
					req.app.render('listBoard.ejs', context, function(err, html) {
                        
						if (err) {                            

                            res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                            res.write('<h2>응답 웹문서 생성 중 에러 발생</h2>');                            
                            res.end();

                            return;
                        }
                        
						res.end(html);
					});
					
				});
				
			} else {
				res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
				res.write('<h2>글 목록 조회  실패</h2>');
				res.end();
			}
		});
	} else {
		res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
		res.write('<h2>데이터베이스 연결 실패</h2>');
		res.end();
	}
	
};


module.exports.addBoard = addBoard;
module.exports.showBoard = showBoard;
module.exports.listBoard = listBoard;


