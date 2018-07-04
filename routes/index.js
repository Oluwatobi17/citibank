var express = require('express');
var router = express.Router();
var session = require('express-session');

var users = [
	{
		userId: 100000,
		email: 'ganiuibrahim3000@gmail.com',
		name: 'Ganiu Ibrahim',
		accountBal: 1200000,
		password: 'ganiu',
		country: 'SINGAPORE',
		currency: 'SGD',
		lastLogin: '24 Jun 2018 at 10:09 PM'
	},
	{
		userId:100001,
		email: 'popoolaoluwatobi2000@yahoo.com',
		name: 'Popoola Oluwatobi',
		accountBal: 1000000,
		password: 'popoola',
		country: 'America',
		currency: 'USD',
		lastLogin: '04 Feb 2018 at 11:09 AM'
	}
]

/* GET for home page route '/' */
router.get('/', (req, res, next) =>{
	res.render('index',{
		message: req.session.message
	});
});

/* POST for route '/login' */
router.post('/login', (req, res, next) =>{
	var mes = false;
	users.filter(function(user){
		if(user.userId == req.body.userId){
			mes = true;
			if(user.password == req.body.password){
				req.session.loggedInUser = user;
				req.session.message = 'Login Successfull!';
				setTimeout(function(){
					req.session.message = null;
				}, 5000);
				res.redirect('/myaccount');
			}else{
				req.session.message = 'Incorrect password!';
				setTimeout(function(){
					req.session.message = null;
				}, 5000);
				res.redirect('/');
			}
		}
	});
	/*for(var i=0;i<users.length; i++){
		if(users[i].userId == req.body.userId){
			mes = true; 
			if(users[i].password == req.body.password){
				req.session.loggedInUser = users[i];
				message = 'Login Successfull!';
				console.log(req.session.loggedInUser)
				setTimeout(defaultMessage, 5000);
				res.redirect('/myaccount');
			}else{
				message = 'Incorrect password!';
				setTimeout(defaultMessage, 5000);
				res.redirect('/');
			}
		}
	}*/
	if(!mes){
		req.session.message ='Unknown user';
		res.redirect('/');
	}
});

router.get('/register',(req, res, next)=>{
	res.render('register',{
		message: req.session.message
	});
})

router.post('/register',(req, res, next)=>{
	if(req.body.password!=req.body.password2){
		req.session.message = 'Password mismatch!'
		setTimeout(function(){
			req.session.message = null;
		}, 5000);
		res.redirect('/register');
	}else{
		/* creating an array for new users */
		var newUser = {
			userId: users[users.length-1].userId+1,
			email: req.body.email,
			name: req.body.name,
			accountBal: req.body.accountBal,
			password: req.body.password,
			country: req.body.country,
			currency: req.body.currency,
			lastLogin: req.body.lastLogin
		}
		/* Adding the information of the new users */
		users.push(newUser);
		req.session.message = 'Registration Successfully! Your new Id is '+newUser.userId;
		newUser = {}
		setTimeout(function(){
			req.session.message = null;
		}, 5000);
		res.redirect('/');
	}
})

router.get('/myaccount', authenticator,(req, res, next) =>{
	setTimeout(function(){
		req.session.message = null;
	}, 5000);
	res.render('myaccount',{
		loggedInUser: req.session.loggedInUser,
		message: req.session.message 
	});
})

/* GET for signoff */
router.get('/signoff', (req, res, next) =>{
	req.session.loggedInUser = null;
	req.session.message = 'You have Successfully Sign Off!';
	res.redirect('/');
})


/* GET to the MAKE A TRANSFER button */
router.get('/transfer', (req, res, next) =>{
	req.session.message = 'Sorry! you cannot make a transfer for now!'
	setTimeout(function(){
		req.session.message = null;
	}, 5000);
	res.redirect('/myaccount');
})

/* POST admin login */
router.post('/admin/login', (req, res, next) =>{
	if(req.body.username=='moneywise' && req.body.password =='ladi222'){
		adminUser = {username: 'moneywise', password: 'ladi222'}
		req.session.message = 'Welcome Mr Admin';
		setTimeout(function(){
			req.session.message = null;
		}, 5000);
		req.session.adminUser = adminUser;
		res.redirect('/register');
	}else{
		req.session.message = 'Incorrect Username or Password!';
		setTimeout(function(){
			req.session.message = null;
		}, 5000);
		res.redirect('/');
	}
});

/* Admin sign out */
router.get('/adminSignout', (req, res, next) =>{
	req.session.adminUser = null;
	req.session.message = 'Admin sign out!';
	setTimeout(function(){
		req.session.message = null;
	}, 5000);
	res.redirect('/');
});

/* GET to admin main page */
router.get('/admin/home', adminAuthenticator,(req, res, next) =>{
	res.render('adminpage', {
		users: users
	});
});

/* POST request for /admin/update */
router.post('/admin/update', (req, res, next) =>{
	var index = users[req.body.index];

	index.email = req.body.email;
	index.name = req.body.name;
	index.accountBal = req.body.accountBal;
	index.password = req.body.password;
	index.country = req.body.country;
	index.currency = req.body.currency;
	index.lastLogin = req.body.lastLogin;

	console.log('update complete!');
	res.redirect('/admin/home');
});

/* Citibank user authenticator */
function authenticator(req, res, next){
	if(req.session.loggedInUser){
		return next();
	}else{
		req.session.message = 'Please sign in!'
		setTimeout(function(){
			req.session.message = null;
		}, 5000);
		res.redirect('/');;
	}
}

/* Citibank admin user authenticator */
function adminAuthenticator(req, res,next){
	if(req.session.adminUser){
		return next();
	}else{
		req.session.message = 'Error has occur, please sign in!'
		res.redirect('/');
	}
}

module.exports = router;
