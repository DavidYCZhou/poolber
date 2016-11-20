var _ = require('lodash');
var Ride = require('../models/ride.model.server.js');
var User = require('../models/user.model.server.js');
var mongoose = require("mongoose");

exports.post = function(req, res) {
	var newRide = new Ride(req.body);
    newRide.rider = req.user;

    newRide.save(function(err) {
    	if (err){
    		console.log(err);
    	}
    	else {
    		res.jsonp(newRide);
    	}
	});
};

exports.read = function(req,res) {
    var id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).send({
            message: 'ride id is invalid'
        })
    }
    //populate with username
    Ride.findById(id).exec(function(err, ride){
        if (err){
            return res.status(400).send(err);
        }
        else if (!ride){
            return res.status(404).send({
                message: 'No ride has been found'
            });
        }else{
            res.json(ride);
        }
        
    });
}

exports.update = function(req,res) {
    var ride = req.ride;
    ride.save(function(err){
        if (err){
            return res.status(400).send({
                message: err
            });
        } else {
            res.json(ride);
        }
    })
};

exports.list = function(req, res) {
    Ride.find().exec(function(err, rides) {
        if (err){
            return res.status(400).send({
                message:err
            });
        }
        else{
            res.json(rides);
        }
    });
};

exports.rideByID = function(req, res, next, id) {
    if (!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).send({
            message: 'article is invalid'
        })
    }

    Ride.findById(id).populate('rider', displayName).exec(function(err, ride){
        if (err){
            return next(err);
        }
        else if (!ride){
            return res.status(404).send({
                message: 'No ride has been found'
            });
        }
        req.ride = ride;
        next()
    });
};

exports.delete = function(req, res){
    var ride = req.ride;
    ride.remove(function(err) {
        if (err){
            return res.status(400).send({
                message: err
            });
        } else {
            res.json(ride);
        }
    });
};
