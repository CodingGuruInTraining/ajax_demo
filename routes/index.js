var express = require('express');
var router = express.Router();


// "Database". Names of places, and whether the user has visited it or not.

var places = [
    {id: "1", name: "Rome", visited: true},
    {id: "2", name: "New York", visited: false},
    {id: "3", name: "Tokyo", visited: false}
];
var counter = places.length;


/* GET home page. */
router.get('/', function(req, res, next) {
    // console.log("checkpoint 1");
    // req.db.collection('travel').distinct('name', function(err, allNames) {
    //     console.log("checkpoint 2");
    //     if(err) {
    //         return next(err)
    //     }
    //     console.log("checkpoint 3");
    req.db.collection('travel').find().toArray(function(err, docs) {
        console.log("checkpoint 4");
        if (err) {
            return next(err)
        }
        console.log("checkpoint 5");
        return res.render('index', { title: 'Travel Wish List'});
    });
    console.log('end of homepage get');
    // });
});

/* GET all items home page. */
router.get('/all', function(req, res, next) {
    req.db.collection('travel').find().toArray(function (err, docs) {
        if (err) {
            return next(err)
        }

        res.json(docs);
        console.log(docs);
        // res.json(places);
    });
});


/* POST - add a new location */
router.post('/add', function(req, res) {
    var name = req.body.name;
    console.log(req.body);
// TODO need to do something with the counter; aint workin right
    var place = { 'id': ++counter + "" , 'name': name, 'visited': false };
    console.log(place);
    req.db.collection('travel').insertOne(place, function(err) {
        console.log(place);
        if(err) {
            return next(err)
        }
        res.status(201);
        res.json(place);
        return res.redirect('/');
    });

    //
    // places.push(place);
    //
    // console.log('After POST, the places list is');
    // console.log(places);
    //
    // res.status(201);      // Created
    // res.json(place);      // Send new object data back as JSON, if needed.

    // TODO may want to check if place already in list and don't add.

});


/* PUT - update whether a place has been visited or not */
router.put('/update', function(req, res){

    var id = req.body.id;
    var newPlace = {$set: {visited: "true"}};  // all the body parameters are strings
    console.log(req.body);
    req.db.collection('travel').findOneAndUpdate(req.body, newPlace, function(err, place) {
            if(err) {
                return next(err);
            }
            // res.status(201);
            res.json(place);
            console.log(req.body.visited);
            // return res.redirect('/');
        }
    );


    // for (var i = 0 ; i < places.length ; i++) {
    //   var place = places[i];
    //   if (place.id == id) {
    //     place.visited = visited;
    //     places[i] = place;
    //   }
    // }

    // console.log('After PUT, the places list is');
    // console.log(places);
    //
    // res.json(place);
    console.log("something might have been updated");
});


router.delete('/delete', function(req, res){

    var place_id = req.body.id;
    console.log(place_id);

    req.db.collection('travel').deleteOne(req.body, function(err) {
        if(err) {
            return next(err);
        }
        res.json();
    });

    // for (var i = 0 ; i < places.length ; i++) {
    //     var place = places[i];
    //     if (place.id == place_id) {
    //         places.splice(i, 1);  //Delete the element at this position
    //         res.json(place);
    //         break;
    //     }
    // }
    //
    // console.log('After DELETE, the places list is');
    // console.log(places);

    res.status(200);
    res.end();

});


console.log("end of routes");
module.exports = router;
