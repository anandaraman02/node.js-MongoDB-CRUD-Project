
const express = require("express");//express js
const app = express();
const bodyparser = require("body-parser")
const exhbs = require("express-handlebars")
const dbo = require('./db');
const ObjectID = dbo.ObjectID;

app.engine('hbs',exhbs.engine({layoutsDir:'views/',deaultLayout:"main",extname:"hbs"}))
app.set('view engine','hbs');
app.set('views','views');
app.use(bodyparser.urlencoded({extended: true}));


//creating a router
app.get('/',async (req,res)=>{
let database = await dbo.getDatabase();
const collection = database.collection('book');
const cursor = collection.find({})
let book = await cursor.toArray();


let message = ''
let edit_id, edit_book;

if(req.query.edit_id){
edit_id = req.query.edit_id;
 edit_book = await collection.findOne({_id: new ObjectID(edit_id)})
}
if(req.query.delete_id){
   await collection.deleteOne({_id: new ObjectID(req.query.delete_id)})
return res.redirect('/?status=3')
}

switch(req.query.status){
    case '1':
        message='inserted sucessfully'
        break;
        case '2':
            message='updated sucessfully'
            break;
            case '3':
                message='Deleted sucessfully'
                break;
        default:
            break;
}


res.render('main',{message,book,edit_id,edit_book})
})

app.post('/store_book',async(req,res)=>{
    let database = await dbo.getDatabase();
    const collection = database.collection('book');
   let book = { title: req.body.title, author: req.body.author}
   await collection.insertOne(book);
   return res.redirect('/?status=1');
})
app.post('/update_book/:edit_id',async (req,res)=>{
    let database = await dbo.getDatabase();
    const collection = database.collection('book');
    let book = { title: req.body.title, author: req.body.author  };
    let edit_id = req.params.edit_id;

    await collection.updateOne({_id: new ObjectID(edit_id)},{$set:book});
    return res.redirect('/?status=2');


})

app.listen(8000,()=>{console.log('listening to 8000 port');})