const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const mongoose = require("mongoose");
const lodash = require("lodash");

mongoose.set("strictQuery", false);
const app = express();
const date = require(__dirname + "/getDate.js");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");
mongoose.connect("mongodb://127.0.0.1:27017/todolistDB", {
  useNewUrlParser: true,
});


const activity = new mongoose.Schema({
  dactivity: String,
});
const dailyactivity = mongoose.model("dailyactivity", activity);

const listSchema = new mongoose.Schema({
  item: [activity],
  name: String,
});
const List = mongoose.model("List", listSchema);



app.listen(3000, function () {
  console.log("Server is up and running at port 3000");
});



app.get("/", (req, res) => {
  dailyactivity.find(function (err, arr) {
    if (err) {
      console.log(err);
    } else {
      console.log("Retrieval successful!");
      res.render("list", { day: "Home", tasks: arr });
    }
  });
});



app.post("/", function (req, res) {
  let item = req.body.todo;
  let day = req.body.btn;
  const tempactivity = new dailyactivity({
    dactivity: item,
  });
  if(day == "Home"){
  tempactivity.save(function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log("Insertion successful");
    }
  });
  res.redirect("/");
}
  else{
    List.findOne({ name: day }, function (err, arr) {
      if (err) {
        console.log(err);
      } else {
        arr.item.push(tempactivity);
        arr.save(function (err) {
          console.log("Added successfully by Post to " + day);
        });
      }
    });
    res.redirect("/" + day);
  }
});



app.get("/:pagename", (req, res) => {
  let customname = lodash.capitalize(req.params.pagename);
  let listactivity = new dailyactivity({
    dactivity: "List is " + customname,
  });
  let listitems = new List({
    name: customname,
    item: []
  });

  List.findOne({ name: customname }, function (err, arr) {
    if (err) {
      console.log(err);
    } else {
      if (!arr) {
        listitems.save(function (err) {
          if (err) {
            console.log(err);
          } else {
            console.log("Added successfully to " + customname);
            res.redirect("/" + customname);
          }
        });
      } else {
        console.log(customname + " list already exists");
        res.render("list", { day: customname, tasks: arr.item });
      }
    }
  });
});



app.get("/about", (req, res) => {
  res.render("about");
});



app.post("/delete", (req, res) => {
  let customname = req.body.listname;
  let id= req.body.uncheck;
  if (customname == "Home") {
    dailyactivity.deleteOne({ _id: req.body.uncheck }, function (err) {
      if (err) {
        console.log(err);
      } else {
        console.log("Deletion successful");
      }
    });
    res.redirect("/");
  }
  else{
      console.log("entered here");
      List.updateOne({name:customname}, {
        $pull: {
            item: {_id: id}
        }},
        function(err){
          if(!err){
            console.log("Deletion Successful from "+customname);
          }
          else{
            console.log(err);
          }
        });
        res.redirect("/"+customname);
    }
  });

