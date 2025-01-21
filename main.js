const port = process.env.PORT || 6969 ;

const app = require('./app')

// Start the server
app.listen(port, () => {
    console.log(`To-Do List API running at http://localhost:${port}`);
});
