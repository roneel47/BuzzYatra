**API DOCUMENT**

base_url = localhost:4000
testing_url = https://psnr7l32-4000.inc1.devtunnels.ms/

## End Points ##
1. /api/getroute

response body - {from,to,userlat,userlong}

example response: 
    { "from": "Hebbal", 
  "to": "Kempegowda Bus Station",
  "userlat":12.977351,
  "userlong": 77.572174
  }

* Description 
- frrom: this is the from bus stop name
- to: this is the to bus stop name
- userlat: this is the current user latitue
- userlong:  this is the current user long

Result:
The end point will provide a list of lats & longs along with the distace in KM and Total time required in min