const https = require('https');
const fs = require('fs');

https.get('https://api.waqi.info/map/bounds/?latlng=17,69,54,136&token=b123eda5a4f77963db6bc499a7cf228288f8aa1d', (resp) => {
  let data = '';

  // A chunk of data has been recieved.
  resp.on('data', (chunk) => {
    data += chunk;
  });

  // The whole response has been received. Print out the result.
  resp.on('end', () => {

    console.log(data);
    var content=JSON.parse(data);
    var output=JSON.stringify(content);
    
    fs.writeFile('Location.json',output,'utf8',function(err){
		if (err) {return console.log(err);}
	}

	)


  });

}).on("error", (err) => {
  console.log("Error: " + err.message);
});
