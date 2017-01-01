"use strict";

var passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy,
	FacebookStrategy = require('passport-facebook').Strategy,
	User = require('mongoose').model('User');
var WechatStrategy = require('passport-wechat').Strategy;
var users = require('../controllers/users.controller.server.js');

module.exports = function (app, db) {
	// Serialize sessions
	passport.serializeUser(function (user, done) {
		done(null, user.id);
	});

	// Deserialize sessions
	passport.deserializeUser(function (id, done) {
		User.findOne({
			_id: id
		}, '-salt -password', function (err, user) {
			done(err, user);
		});
	});

	// Define local strategy
	var Local = new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password'
	},
	function (email, password, done) {
		User.findOne({
			email: email
		}, function (err, user) {
			if (err) {
				return done(err);
			}
			if (!user || !user.authenticate(password)) {
				return done(null, false, {
					message: 'Invalid email or password'
				});
			}
			return done(null, user);
		});
	});


	//define facebook strategy
	var Facebook = new FacebookStrategy({
		clientID: '215191925596240',
		clientSecret: '32bd522b06ba5c9b9236cf9efa5bc522',
		callbackURL: '/api/auth/facebook/callback',
		profileFields: ['id', 'name', 'displayName', 'emails', 'photos'],
		passReqToCallback: true
	},
	function (req, accessToken, refreshToken, profile, done) {
		// Set the provider data and include tokens
		var providerData = profile._json;
		providerData.accessToken = accessToken;
		providerData.refreshToken = refreshToken;
		// Create the user OAuth profile
		var providerUserProfile = {
			firstName: profile.name.givenName,
			lastName: profile.name.familyName,
			displayName: profile.displayName,
			email: profile.emails ? profile.emails[0].value : undefined,
			profileImageURL: (profile.id) ? '//graph.facebook.com/' + profile.id + '/picture?type=large' : undefined,
			provider: 'facebook',
			providerID: profile.id,
			providerData: providerData
		};
		// Save the user OAuth profile
		users.saveOAuthUserProfile(req, providerUserProfile, done);
	});

	//define wechat strategy
	var Wechat = new WechatStrategy({
		appID: 'wx3b75bcb08db37e6a', //wxfe8d08cc30586362',				
		appSecret: '3c22fc0a9a9dd092a06580613a5c0022', //'3b9b6424f581913f22417f305abf6960',		
		callbackURL: 'http://www.poolber.ca/api/auth/wechat/callback',
		scope: 'snsapi_userinfo',
		state: '123',
	},
	function (accessToken, refreshToken, profile, expires_in, done) {
		// Set the provider data and include tokens
		console.log(profile);
		var providerData = profile;
		providerData.accessToken = accessToken;
		providerData.refreshToken = refreshToken;

		// Create the user OAuth profile
		var providerUserProfile = {
			displayName: profile.nickname,
			provider: 'wechat',
			providerID: profile.openid,
			providerData: providerData
		};
		// Save the user OAuth profile

		users.saveOAuthUserProfile({}, providerUserProfile, done);
	});


	passport.use(Local);
	passport.use(Facebook);
	passport.use(Wechat);


	// Add passport's middleware
	app.use(passport.initialize());
	app.use(passport.session());
};