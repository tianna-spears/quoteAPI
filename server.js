const express = require('express');
// const morgan = require('morgan');
const app = express();

const { quotes } = require('./data');
const { getRandomElement } = require('./utils');

const PORT = process.env.PORT || 4001;

app.use(express.static('public'));

quotes.forEach((quote, index) => {
  quote.id = index + 1;
})

app.get('/api/quotes/random', (req, res, next) => {
    const getRandomQuote = getRandomElement(quotes);
  res.send({ quotes: getRandomQuote })
})

app.get('/api/quotes', (req, res, next) => {
  const person = req.query.person;

  if (person) {
    const matchingQuotes = quotes.filter(quote => quote.person === person);
    res.send({ quotes: matchingQuotes });
  } else {
    res.send({ quotes: quotes });
  }
});

app.post('/api/quotes', (req, res, next) => {
  const quoteText= req.query.quote;
  const personName= req.query.person;

    if (quoteText && personName) {
      const newQuote= {
        quote: quoteText,
        person: personName
      };
      quotes.push(newQuote);
      res.send({ quote: newQuote }) 
    } else {
      res.status(400).send();
    }
})

app.put('/api/quotes/:id', (req, res, next) => {
  const findID = Number(req.params.id);
  const updatedQuote = req.query.quote;
  const updatedPerson = req.query.person;

  const quote = quotes.find( quote => quote.id === findID);

  if (quote) {
    if (updatedQuote) {
      quote.quote = updatedQuote;
    } if (updatedPerson) {
      quote.person = updatedPerson;
    } res.send ({ quote: quote })
  } else {
    res.status(404).send();
  }
})

app.delete('/api/quotes/:id', (req, res, next) => {
  const findID = Number(req.params.id);

  const index = quotes.findIndex(quote => quote.id === findID);

  if (index !== -1) {
    quotes.splice(index, 1)
    res.status(200).send( {Message: "Quote deleted!"} )
  } else {
    res.status(404).send( {Message: "Quote not found!"} )
  }
})


app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
})
