drop table if exists question;
create table question (
  id integer primary key autoincrement,
  category text not null,
  question text not null
);

drop table if exists fillers;
create table fillers (
  id integer primary key autoincrement,
  questionid integer not null,
  answer text not null,
  FOREIGN KEY(questionid) REFERENCES question(id)
);