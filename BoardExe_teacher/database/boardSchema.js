
//게시판을 위한 데이터베이스 스키마를 정의하는 모듈

var autoIncrement = require('mongoose-auto-increment');

var SchemaBoard = {};

SchemaBoard.createSchema = function(mongoose) {	
	
	
	// 글 스키마 정의
	//users4에 이메일로 작성자확인
	var BoardSchema = mongoose.Schema({
	    num: {type: Number, 'default': 0},
	    title: {type: String, trim: true, 'default':''},		// 글 제목
	    contents: {type: String, trim:true, 'default':''},		// 글 내용
	    writer: {type: mongoose.Schema.ObjectId, ref: 'users4'},// 글쓴 사람
	    hitCount: {type: Number, 'default': 0},   // 조회수
	    created: {type: Date, index: {unique: false}, 'default': Date.now}
	});
	
	// 필수 속성에 대한 'required' validation
	BoardSchema.path('title').required(true, '글 제목을 입력하셔야 합니다.');
	BoardSchema.path('contents').required(true, '글 내용을 입력하셔야 합니다.');
	
	//일렬번호
	autoIncrement.initialize(mongoose.connection);
	BoardSchema.plugin(autoIncrement.plugin,
			{model : 'BoardModel',
			field : 'num', 
			startAt : 1,
			increment : 1});	
	
	// 스키마에 인스턴스 메소드 추가
	BoardSchema.methods = {
			
		saveBoard: function(callback) {		// 글 저장
			
			var self = this;
			
			this.validate(function(err) {
				if (err) return callback(err);
				
				self.save(callback);
			});
		}	
		
	}
	
	BoardSchema.statics = {
			
		// ID로 글 찾기
		load: function(id, callback) {
			this.findOne({_id: id})
				.populate('writer', 'name provider email')
				.populate('comments.writer')
				.exec(callback);
		},
		
		list: function(option, callback) {
			
			var criteria = option.criteria || {};
			
			this.find(criteria)
				.populate('writer', 'name provider email')
				.sort({'created': -1})
				.limit(Number(option.perPage))
				.skip(option.perPage * option.page)
				.exec(callback);
		},
		
		updateHitCount: function(id, callback) { //조회수 증가
            var query = {_id: id};
            var update = {$inc: {hitCount:1}};
            var options = {upsert:true, 'new':true, setDefaultsOnInsert:true};
            
            this.findOneAndUpdate(query, update, options, callback);            
        }
	}
	
	console.log('BoardSchema 정의함.');

	return BoardSchema;
};

// module.exports에 BoardSchema 객체 직접 할당
module.exports = SchemaBoard;

