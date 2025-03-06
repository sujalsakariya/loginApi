const express = require('express');
const router = express.Router();
const controllers = require('./controllers');

router.post('/signup', controllers.signup);
router.post('/login', controllers.login);
router.post('/add-lead', controllers.addLead); // Requires Token
router.get('/leads', controllers.getLeads);

module.exports = router;
