const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const path = require("path");

console.log("FOLDER:", __dirname);

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname));

// ================= MYSQL CONNECTION =================
const db = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "Diva@2004",
    database: "studentDB"
});

db.connect((err) => {
    if (err) {
        console.log("❌ Connection Failed:", err);
    } else {
        console.log("✅ MySQL Connected...");
    }
});

// ================= HOME =================
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// ================= VIEW PAGE =================
app.get("/view", (req, res) => {
    res.sendFile(__dirname + "/view.html");
});

// ================= FETCH DATA (for view.html) =================
app.get("/data", (req, res) => {
    db.query("SELECT * FROM student_info", (err, result) => {
        if (err) throw err;
        res.json(result);
    });
});

// ================= ADD =================
app.post("/add", (req, res) => {
    const { name, email, age } = req.body;

    db.query(
        "INSERT INTO student_info (name, email, age) VALUES (?, ?, ?)",
        [name, email, age],
        (err) => {
            if (err) throw err;
            res.redirect("/");
        }
    );
});

// ================= DELETE =================
app.post("/delete", (req, res) => {
    db.query(
        "DELETE FROM student_info WHERE id=?",
        [req.body.id],
        (err) => {
            if (err) throw err;
            res.redirect("/");
        }
    );
});

// ================= UPDATE =================
app.post("/update", (req, res) => {
    const { id, name, email, age } = req.body;

    db.query(
        "UPDATE student_info SET name=?, email=?, age=? WHERE id=?",
        [name, email, age, id],
        (err) => {
            if (err) throw err;
            res.redirect("/");
        }
    );
});

// ================= SERVER =================
app.listen(3000, () => {
    console.log("🚀 Server running at http://localhost:3000");
});