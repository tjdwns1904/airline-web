const express = require("express");
const path = require('path');
const app = express();
var mysql = require('mysql2');
var bodyParser = require('body-parser');
var cors = require('cors');
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static(path.join(__dirname, 'build')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
})
app.listen(8080, function () {
  console.log("Server on port 8080");
});
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "0000",
  database: "mydb"
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});

app.post('/users', (req, res) => {
  console.log(req);
  var sql = "SELECT * FROM users WHERE email = ? AND password = ?"
  var email = req.body.email;
  var password = req.body.password;
  if (email && password) {
    con.query(sql, [email, password], (err, result) => {
      if (err) throw err;
      res.send(result);
    });
  };
});

app.get('/flight', (req, res) => {
  con.query("SELECT * FROM flights", function (err, result) {
    if (err) throw err;
    console.log(req);
    res.send(result);
  });
});

app.get('/flightDetail?', (req, res) => {
  var id = req.query.id;
  con.query("SELECT * FROM flights where id = ?", id, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

app.post('/signUp', (req, res) => {
  console.log(req);
  let sql = "INSERT INTO users (email, name, password, type) VALUES (?, ?, ?, ?)";
  let sql1 = "SELECT * FROM users WHERE email = ?";
  let email = req.body.email;
  let name = req.body.name;
  let password = req.body.password;
  let type = req.body.type;
  if (email && name && password && type) {
    con.query(sql1, email, (err, result) => {
      if (err) throw err;
      if (result.length > 0) {
        res.status(202).send("Failed");
      } else {
        con.query(sql, [email, name, password, type], (err) => {
          if (err) throw err;
          res.status(201).status("Success");
        });
      }
    });
  };
});

app.post('/book', (req, res) => {
  console.log(req);
  var userId = req.body.user_id;
  var flightId = req.body.flight_id;
  con.query("INSERT INTO booking (user_id, flight_id) VALUES (?, ?)", [userId, flightId], (err) => {
    if (err) throw err;
    res.status(201).send("Booking Completed!")
  });
});

app.get('/history?', (req, res) => {
  var user_id = req.query.user_id;
  con.query("SELECT flight_id FROM booking WHERE user_id = ?", user_id, (err, result) => {
    if (err) throw err;
    if (result.length > 0) {
      var ids = [];
      result.map(r => {
        ids.push(r.flight_id);
      });
      con.query("SELECT * FROM flights WHERE id in (?)", [ids], (e, re) => {
        if (e) throw e;
        res.send(re);
      });
    };
  });
});

app.post('/add', (req, res) => {
  console.log(req);
  const sql = "INSERT INTO flights (flightNumber, dCity, aCity, dTime, aTime, price) VALUES (?, ?, ?, ?, ?, ?)";
  var flightNumber = req.body.flightNumber;
  var dTime = req.body.dTime;
  var aTime = req.body.aTime;
  var dCity = req.body.dCity;
  var aCity = req.body.aCity;
  let price = req.body.price;
  con.query("SELECT * FROM flights WHERE flightNumber = ? AND dTime = ? AND aTime = ?", [flightNumber, dTime, aTime],
    (err, result) => {
      if (err) throw err;
      if (result.length >= 1) {
        res.status(202).send("Failed");
      } else {
        con.query(sql, [flightNumber, dCity, aCity, dTime, aTime, price], (e, r) => {
          if (e) throw e;
          res.status(201).send("Completed");
        })
      }
    });
});

app.put("/update/:id", (req, res) => {
  let id = req.params.id;
  let flightNumber = req.body.flightNumber;
  let dTime = req.body.dTime;
  let aTime = req.body.aTime;
  let dCity = req.body.dCity;
  let aCity = req.body.aCity;
  let price = req.body.price;
  const sql = "UPDATE flights SET flightNumber = ?, dTime = ?, aTime = ?, dCity = ?, aCity = ?, price = ? WHERE id = ?";
  con.query("SELECT * FROM flights WHERE flightNumber = ? AND dTime = ? AND aTime = ? AND id != ?", [flightNumber, dTime, aTime, id],
    (err, result) => {
      if (err) throw err;
      if (result.length >= 1) {
        res.status(202).send("Failed");
      } else {
        con.query(sql, [flightNumber, dTime, aTime, dCity, aCity, price, id], (e) => {
          if (e) throw e;
          res.status(201).send("Update completed!");
        });
      }
    });
  
});

app.delete("/delete/:id", (req, res) => {
  let id = req.params.id;
  const sql = "DELETE FROM flights WHERE id = ?";
  const sql1 = "DELETE FROM booking WHERE flight_id = ?";
  con.query(sql, id, (err) => {
    if (err) throw err;
    con.query(sql1, id, (e) => {
      if (e) throw e;
      res.status(201).send("Flight Deleted");
    });
  });
});

app.get("/book?", (req, res) => {
  let userId = req.query.id;
  con.query("SELECT flight_id FROM booking WHERE user_id = ?", userId, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

app.delete("/cancel/:id/:userID", (req, res) => {
  let id = req.params.id;
  let user_id = req.params.userID;
  const sql = "DELETE FROM booking WHERE flight_id = ? AND user_id = ?";
  con.query(sql, [id, user_id], (err) => {
    if (err) throw err;
    res.status(201).send("Book Cancelled");
  });
});