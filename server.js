const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
var { graphqlHTTP } = require('express-graphql');
var { graphql, buildSchema } = require('graphql');
const app = express();
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
  
});

var schema = buildSchema(`
  type Query {
    add(a: Int!, b: Int): [Int]
  }
`);

// The root provides a resolver function for each API endpoint
var resolvers = {  
  add: ({a, b}) => {
    const output =[]
    output.push(a+b)
    return output;
  }
};

app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: resolvers,
  graphiql: true,
}));

app.post('/add',(req, res) => {
  graphql(schema, `{ add(a:${req.body.a}, b:${req.body.b}) }`, resolvers).then((response) => {
    //var obj = JSON.parse(response)
  //var json = JSON.stringify(response);
  //var obj = JSON.parse(json)
  console.log(response)
  //const output = obj.data.add[0]
  res.send(response)  
  });
})


app.listen(5000, () => {
  console.log(`Server is running on port 5000.`);
});
