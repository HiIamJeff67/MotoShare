Remember to make the exception of 500 and 520 be the same output : 520

* **E-S-100** - Specifying not allowed phone number in IsPhoneNumber decorator
	* status : Internal Server Error 500
	* message : "Specifying not allowed phone number on IsPhoneNumberString decorator"

* **E-S-700** - Failed to translate bearer token to payload
	* status : Internal Server Error 500
	* message : "Failed to translate bearer token to payload"

* **E-S-701** - Can not find any user(included passengers and ridders) in socket map
	* status : NotFound 404
	* message : "Cannot find any user(included Passengers and Ridders) in socket map"

* **E-S-800** - Missing Neon connection
	* status : Internal Server Error 500
	* message : "Missing connection to Neon server(powered by postgreSQL database)"

* **E-S-801** - Cannot find some necessary environment variables for connecting Neon server
	* status : Internal Server Error 500
	* message : "Cannot find some necessary environment variables for connecting to Neon server"

* **E-S-810** - Failed to update expired purchaseOrder
	* status : Internal Server Error 500
	* message : "Failed to update expired purchaseOrders before user get them"

* **E-S-811** - Failed to update expired supplyOrders
	* status : Internal Server Error 500
	* message : "Failed to update expired supplyOrders before user get them"

* **E-S-812** - Failed to update expired orders
	* status : Internal Server Error 500
	* message : "Failed to update start status of orders before user get them"

* **E-S-850** - Missing Supabase connection
	* status : Internal Server Error 500
	* message : "Missing connection to Supabase server(powered by postgreSQL database)"

* **E-S-851** - Cannot find some necessary environment variables for connecting Supabase server
	* status : Internal Server Error 500
	* message : "Cannot find some necessary environment variables for connecting to Supabase server"

* **E-S-852** - Missing parameters while uploading file to Supabase server
	* status : Internal Server Error 500
	* message : "Missing parameters while uploading file to Supabase server"

* **E-S-853** - Failed to upload file to Supbase storage
	* status : Internal Server Error 500
	* message : "Failed to upload file to Supabase storage"
	* possible messages about : listError, deleteError, uploadError, getPublicUrlError

* **E-S-900** - Failed to extract the required environment variable JWT_SECRET
	* status : Internal Server Error 500
	* message : "Failed to extract the required environment variable JWT_SECRET"

* **E-S-999** - Unknown server error : 
	* status : Internal Server Error 500
	* message : "Internal Server Error"