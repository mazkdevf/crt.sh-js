const fs = require("fs")
const CrtshAPI = require("./CrtshAPI.js");

  const crtsh = new CrtshAPI();
  crtsh.search("koodari.dev")
    .then(data => {
      console.log(data)
      fs.writeFile(`./${data.domain}.json`, JSON.stringify(data, null, 3), function(err) {
        if(err) {
            return console.log(err);
        }
        console.log(`Tallenettu tiedostolle: ${data.domain}.json`);
      });
    })
    .catch(error => console.error(error));
  