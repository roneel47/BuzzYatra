const express = require('express');
const app = express();
const PORT = 5000;

app.get('/', (req, res) => {
//   res.send('Backend is running!');
  res.send("<h1>Welcome to the Backend!</h1>");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
