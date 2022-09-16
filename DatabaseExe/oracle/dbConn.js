const oracledb = require('oracledb');
const dbConfig = require('./dbConfig');

oracledb.autoCommit = true;

oracledb.getConnection(
  {
    user: dbConfig.user,
    password: dbConfig.password,
    connectString:dbConfig.connectString
  },
  function (err, conn){
    if (err) {
      throw err;
    } 

    console.log('Oracle DB 연결 성공!');
    let sql;
    // sql = 'create table cuser(id varchar2(10), password varchar2(10),';
    // sql += 'name varchar2(10), age number)';

    // conn.execute(sql);
    // console.log('테이블 생성 완료');


    // //insert
    // sql = 'insert into cuser value(:id, :pw, :name, :age)'

    // // binds = [['1', 'a123', 'inna1', 40]];

    // binds =
    //   [
    //     ['1', 'a123', 'inna1', 40],
    //     ['2', 'a123', 'inna2', 40],
    //     ['3', 'a123', 'inna3', 40],
    //     ['4', 'a123', 'inna4', 40],
    //     ['5', 'a123', 'inna5', 40],
    //     ['6', 'a123', 'inna6', 40],
    //   ];
    
    // const result = conn.executeMany(sql, binds, function () {
    //   console.log('입력 완료');
    // })

    // //update
    // sql = 'update cuser set password=:pw, name=:name, age=:age where id =: id';

    // conn.executeMany(sql, [['777', 'suzi', 27, '1']]);
    // console.log('입력 완료');

    // //delete
    // sql = 'delete cuser where id=:id';

    // conn.execute(sql, ['1']);
    // console.log('삭제 완료');
 
    // //select
    // sql = 'select id, password, name, age from cuser';
    // conn.execute(sql, [], (err, result) => {
    //   if (err) throw err;
    //   console.log(result.rows);
    //   doRelease(conn);

    // })

  });

  const doRelease = (conn) => {
    conn.release((err) => {
      if (err) throw err;
    })
  }