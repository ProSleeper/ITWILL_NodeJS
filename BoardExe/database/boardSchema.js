

const autoIncrement = require('mongoose-auto-increment');

const SchemaBoard = {};

SchemaBoard.createSchema = function (mongoose) {

  console.log("보드스키마 정의함");
  const BoardSchema = mongoose.Schema({
    num: { type: Number, 'default': 0 },
    title: { type: String, trim: true, 'default': '' },
    content:{type:String, trim:true, 'default':''},
    writer: { type: mongoose.Schema.ObjectId, ref: 'users4' },
    hitCount: { type: Number, 'default': 0 },
    created: { type:Date, 'default': Date.now}
  })
  
  BoardSchema.path('title').required(true, '글 제목을 입력하세요.');
  BoardSchema.path('content').required(true, '글 내용을 입력하세요.');

  //일렬번호
  autoIncrement.initialize(mongoose.connection);

  BoardSchema.plugin(autoIncrement.plugin,
    {
      model: 'BoardModel',
      field: 'num',
      startAt: 1,
      increment: 1
    })
  BoardSchema.methods = {
    saveBoard: function (callback) { 
      const self = this;

      this.validate(function (err) {
        if (err) return callback(err);
      
        self.save(callback);
      })
    }
  }

  BoardSchema.statics = {
  
    load: function (id, callback) {
      this.findOne({ _id: id })
        .populate('writer', 'name provider email')
        .exec(callback);
    },
    list: function (options, callback) {
      this.find({})
        .populate('writer', 'name provider email')
        .sort({ 'created': -1 }) //정렬: 0은 asc -1 desc
        .limit(Number(options.perPage))
        .skip(options.perPage * options.page)
        .exec(callback);
    },
    updateHitCount: function (id, callback) { 
      const query = { _id: id };
      const update = { $inc: { hitCount: 1 } };
      const options = { upsert: true, 'new': true, setDefaultsInsert: true };
      this.findOneAndUpdate(query, update, options, callback);
    }

}

console.log('BoardSchema 정의함');
  return BoardSchema;

};


module.exports = SchemaBoard;

