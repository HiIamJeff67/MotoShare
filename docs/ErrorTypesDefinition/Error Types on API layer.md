* **E-A-001** - Missing parameters
	* status : BadRequest 400, 
	* message : "Require parameters"
* **E-A-002** - Missing body or wrong body dto
	* status : BadRequest 400, 
	* message : "Require body and customized dto of current route"

* **E-A-010 -** Search with too large limit
	* status : NotAcceptable 406,
	* message : "Cannot search with the limit greater than ${maxLimit}"

* **E-A-011** - Search with less than zero limit
	* status : NotAcceptable 406,
	* message : "Cannot search with limit less than ${minLimit}"

* **E-A-100** - Detected wrong form of prevOrderId field on OrderTable
	* status : NotAcceptable 406
	* message : "Wrong form of prevOrderId field on OrderTable detected, its length should be exactly 2"

* **E-A-101** - Detected wrong form of ISOString
	* status : NotAcceptable 406
	* message: : "Wrong form of ISO date string when converting it to time only string"

* **E-A-200** - Detected wrong webhook signature
	* status : NotAcceptable 406
	* message : "Wrong webhook signature detected, please provide a valid signature"

* **E-A-201** - Cannot find the Endpoint environment variable
	* status : NotFound 404
	* message : "Cannot find some necessary environment variables for sepecifying endpoint for Stripe webhooks"

* **E-A-202** - Stripe webhook unhandled or undefined
	* status : Forbidden 403
	* message : "This request is unhandled due to it is undefined in stripe"

* **E-A-400** - Payment Intent not finished
	* status : Forbidden 403
	* message : "The transaction is not finished, please try again"

* **E-A-401** - Detected non-positive amount
	* status : Forbidden 403
	* message : "Detected non-positive amount"

* **E-A-900** - Failed to generate a bearer token
	* status : InternalServerError 500
	* message : "Failed to generate a bearer token for current user"

* **E-A-901** - Failed to generate a auth code
	* status : InternalServerError 500
	* message : "Failed to generate a auth code for current user"

* **E-A-902** - Failed to send a email for validation
	* status : InternalServerError 500
	* message : "Failed to send a email for validation"

* **E-A-950** - Missing userrole in header while connecting to socket
	* status : BadRequest 400
	* message : "Missing userrole field in header while connecting to socket"
	
* **E-A-999** - Unknown API error : 
	* status : Unknown Error 520
	* message : "Unknown error occurred"