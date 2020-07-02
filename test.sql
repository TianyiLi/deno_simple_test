CREATE TABLE users(
  id INT AUTO_INCREMENT PRIMARY KEY,
  name TEXT
  password TEXT
  info TEXT
);
CREATE TABLE activity(
  id INT AUTO_INCREMENT PRIMARY KEY,
  name TEXT
);
CREATE TABLE user_activity(
  id INT AUTO_INCREMENT PRIMARY KEY,
  activity_id INT,
  user_id INT,
  occurrence timestamp,
  FOREIGN KEY(activity_id) REFERENCES activity(id),
  FOREIGN KEY(user_id) REFERENCES users(id)
);
insert into users
values (1, 'test'),
  (2, 'hello'),
  (3, 'ok');
insert into activity
values (1, 'click'),
  (2, 'touch');
insert into user_activity (activity_id, user_id, occurrence)
values (1, 1, '2020-10-02'),
  (2, 1, '2020-05-01'),
  (1, 2, '2020-01-02'),
  (1, 2, '2020-10-03');
SELECT a.name AS activity_name,
  u.name AS user_name,
  MIN(au.occurrence) AS first_occurrence,
  MAX(au.occurrence) AS last_occurrence,
  COUNT(*) AS amount
FROM users AS u
  JOIN user_activity AS au ON au.activity_id = u.id
  JOIN activity AS a ON a.id = au.activity_id
WHERE MONTH(au.occurrence) = 10
GROUP BY user_id,
  activity_id