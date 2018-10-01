module.exports = (app) => {
    const firstTab = require('../controllers/input.controller.js');

    // Create a new list
    app.get('/firstTab', firstTab.insert);

    // Create a contact list
    app.post('/firstTab', firstTab.create);

    //Retrieve the complete contact list
    app.get('/contactlist',firstTab.findAll);

}
