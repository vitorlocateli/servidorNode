console.log("App online!");

var express = require("express");
var app = express();
const bodyParser = require("body-parser");
var port = process.env.PORT || 8080;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
var sqlite3 = require("sqlite3").verbose();
const DBPATH = "appBD.db";
var db = new sqlite3.Database(DBPATH);

app.get("/", function (req, res) {
  res.send("Tudo certo por aqui!");
});

app.get("/tudo", function (req, res) {
  qTeste = `SELECT * FROM users`;
  db.all(qTeste, [], (err, rows) => {
    if (err) {
      res.send(err);
    } else {
      res.send(rows);
    }
  });
});

app.post("/register", function (req, res) {
  var nome = req.body.nome;
  var email = req.body.email;
  var senha = req.body.senha;

  qSelect = `SELECT * FROM users WHERE email='${email}'`;
  db.all(qSelect, [], (err, rows) => {
    if (err) {
      res.send("Erro na busca: " + err);
    } else {
      if (rows.length > 0) {
        res.send("Usuário já existe!");
      } else {
        qInsert = `INSERT INTO users (nome,email,senha) VALUES ('${nome}','${email}', '${senha}')`;
        db.run(qInsert, [], (err) => {
          if (err) {
            res.send("Erro na gravação do banco: " + err);
          } else {
            res.send("Usuário cadastrado!");
          }
        });
      }
    }
  });
});

app.get("/login", function (req, res) {
  var email = req.body.email;
  var senha = req.body.senha;
  qLogin = `SELECT * FROM users WHERE email='${email}'`;
  db.all(qLogin, [], (err, rows) => {
    if (err) {
      res.send("Erro na busca: " + err);
      Console.log(err);
    } else {
      if (rows.length === 0) {
        res.send("Email incorreto");
      } else {
        if (rows[0].senha === senha) {
          res.send("Login realizado com sucesso" );
        } else {
          res.send("Senha incorreta" );
        }
      }
    }
  });
});

app.delete("/deleteUser", function (req, res) {
  var email = req.body.email;
  sql = `DELETE FROM users WHERE email='${email}'`;
  db.run(sql, [], (err) => {
    if (err) {
      res.send("Erro na exclusão: " + err);
    } else {
      res.send("Usuário excluído!");
    }
  });
});

app.listen(port);
