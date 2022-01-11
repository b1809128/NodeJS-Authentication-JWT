const express = require("express");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = 5000;
/**
 * Dang nhap
 * Tao token
 * Lay token kiem tra
 * Decode ra user ->  kiem tra trong database
 * Phan quyen bang roles
 * Truy cap voi authorization banng middleware function check[login,student,teacher,user,validateToken]
 */
const database = [
  { username: "manager", password: "1", role: "manager" },
  { username: "student", password: "1", role: "student" },
  { username: "teacher", password: "1", role: "teacher" },
];

app.get("/", (req, res) => {
  res.json({ message: "hello, this is server" });
});

app.get("/task", checkLogin, checkStudent, (req, res) => {
  res.json({ message: "hello, this is task" });
});

app.get("/student", checkLogin, checkTeacher, (req, res) => {
  res.json({ message: "hello, this is student" });
});

app.get("/teacher", checkLogin, checkManager, (req, res) => {
  res.json({ message: "hello, this is teacher" });
});


//Login
app.post("/api/login", (req, res) => {
  var id = { username: "manager" };
  const token = jwt.sign({ id }, "secretKey");
  res.json({ token: token });
});

app.get("/api/protected", validateToken, (req, res) => {
  jwt.verify(req.token, "secretKey", (err, data) => {
    if (err) {
      res.sendStatus(403);
    } else {
      res.json({ message: "hello, protected", data: data });
    }
  });
});

//Middleware tai su dung
function checkLogin(req, res, next) {
  try {
    var token ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6eyJ1c2VybmFtZSI6Im1hbmFnZXIifSwiaWF0IjoxNjQxOTEzMTg5fQ.k6RkHIVWL1BWzf-vPlS372px_aZrxch1psRDGtex8aQ"
    var idUser = jwt.verify(token, "secretKey");

    if (database.username == idUser.username) {
    //   req.data = data;
      next();
    } else {
      res.json("NOT PERMISSION");
    }
  } catch (error) {
    res.json({ error: "Not access token" });
  }
}

function checkStudent(req, res, next) {
  const role = "manager";
  if (role == "student" || role == "teacher" || role == "manager") {
    next();
  } else {
    res.json("NOT PERMISSION");
  }
}

function checkTeacher(req, res, next) {
  const role = "manager";
  if (role == "teacher" || role == "manager") {
    next();
  } else {
    res.json("NOT PERMISSION");
  }
}

function checkManager(req, res, next) {
  const role = "manager";
  if (role == "manager") {
    next();
  } else {
    res.json("NOT PERMISSION");
  }
}
function validateToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  } else {
    res.sendStatus(403);
  }
}

app.listen(PORT, () =>
  console.log(`Server is running on http://localhost:${PORT}`)
);
