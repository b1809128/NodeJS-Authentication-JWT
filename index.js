const express = require("express");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());
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
  var username = req.body.username;

  const token = jwt.sign({ username }, "secretKey");
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
    var token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlYWNoZXIiLCJpYXQiOjE2NDE5MTYzMjB9.J5O7Lr7ikl1vvfLa7tTOtBUxfdcuAiSF3_N_kcijLXM";
    var idUser = jwt.verify(token, "secretKey");
    const dataSet = database.map((data) => {
      if (data.username == idUser.username) {
        req.data = data;
        return true;
      }
      return false;
    });
    // console.log(dataSet);
    if (dataSet) {
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
  const role = req.data.role;
  if (role == "student" || role == "teacher" || role == "manager") {
    next();
  } else {
    res.json("NOT PERMISSION");
  }
}

function checkTeacher(req, res, next) {
  const role = req.data.role;
  if (role == "teacher" || role == "manager") {
    next();
  } else {
    res.json("NOT PERMISSION");
  }
}

function checkManager(req, res, next) {
  const role = req.data.role;
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
