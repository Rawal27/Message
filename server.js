const express = require('express');
const bodyParser = require('body-parser');


//create express app
const app = express();

// view engine ejs
app.set('view engine', 'ejs');

//parse requests of content-type -application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}))


//parse request of content-type - application/json
app.use(bodyParser.json())

// Configuring the database
const dbConfig = require('./config/database.config.js');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// Connecting to the database
mongoose.connect(dbConfig.url, {
    useNewUrlParser: true
}).then(() => {
    console.log("Successfully connected to the database");    
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});





//route
app.get('/', (req, res) => {
   //res.json({"message": "Hello Kitty!!"});
   res.render('list');
});


    var contacts = [
       {id: 1, first: 'Robert', last:'Downey', phone: '8145884086'},
       {id: 2, first: 'Mark', last:'Ruffalo', phone: '8245884086'},
       {id: 3, first: 'Scarlett', last:'Johnson', phone: '8345884086'},
       {id: 4, first: 'Chris', last:'Evans', phone: '8445884086'},
       {id: 5, first: 'Chris', last:'Hemsworth', phone: '8745884086'},
	{id: 6, first: 'Leonardo', last:'Dicaprio', phone: '8045884086'},
 	{id: 7, first: 'Jennifer', last:'Lawrence', phone: '865884086'},
 	{id: 8, first: 'Cameron', last:'Diaz', phone: '8445884086'},
  	{id: 9, first: 'Matt', last:'Damon', phone: '8445854086'},
       {id: 10, first: 'Bradley', last:'Cooper', phone: '8449854086'},
       {id: 11, first: 'Shahrukh', last:'Khan', phone: '8145884086'},

      ];


const Input = require('./app/models/input.model.js');

 app.get('/list', (req, res)=> {

    Input.find()
    .then(inputs => {
        
        res.render('list', {contacts:contacts, inputs:inputs});
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving notes."
        });
    });

   
  // res.render('list',{contacts:contacts});
});



// Retrieve and return all notes from the database.
app.get('/all',(req, res) => {
    Input.find()
    .then(inputs => {
        res.send(inputs);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving notes."
        });
    });
});





 app.get('/list/:id', (req, res) => {
     var contact = {};
     for(var i=0; i<contacts.length;i++)
      {
        if(req.params.id==contacts[i].id)
          {
           contact = contacts[i];
           break;
          }           
      }
     res.render('show',{contact:contact});    
});

//var number = Math.floor((Math.random()*1000000)+1);



app.get('/list/:id/compose', (req, res)=> {
  var number = Math.floor((Math.random()*1000000)+1);    
  //console.log(req.params.id);
   res.render('compose', {otp:number, id:req.params.id});
});


app.get('/list/:id/compose/send/:otp', (req,res)=>{
 
 var i = req.params.id;
    // Saving the contact in db
    const contact = new Input({
        firstName:contacts[i-1].first ,
        lastName:contacts[i-1].last,
        phone:contacts[i-1].phone, 
        otp:req.params.otp
    });

    // Save Note in the database
    contact.save()
    .then(data => {
        
    var twilio = require('twilio');

// Entering account sid and auth token in from Twilio account Console.
  var client = new twilio('ACfa964e32a341a6387272c9bc4a439dff', '2d78ef41aa1240416b3a0dc6dfc1306c');

    // Send the text message.
  client.messages.create({
    to: `+91 ${contact.phone}`,
    from: '+1 539 232 0547',
    body: `Hi. Your OTP is: ${req.params.otp}`
  });



   res.render('index', {contacts:contacts});
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while saving the contact."
        });
    });

}); 

  app.get('/contacts', (req, res) => {
    Input.find()
    .then(inputs => {
        res.send(inputs);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving notes."
        });
    });
  }
);


  // Delete a contact with the specified Id in the request
 app.get('/delete/:id', (req, res) => {
    Input.findByIdAndRemove(req.params.id)
    .then(input => {
        if(!input) {
            return res.status(404).send({
                message: "Contact not found with id " + req.params.id
            });
        }
        res.send({message: "Contact deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "Contact not found with id " + req.params.id
            });                
        }
        return res.status(500).send({
            message: "Could not delete contact with id " + req.params.id
        });
    });
});






require('./app/routes/input.routes.js')(app);

const port = process.env.PORT || 8080;
//listen to requests
app.listen(port, () => {
    console.log("Welcome to port 3000");
});



