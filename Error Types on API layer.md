1. **E-A-001** - Missing parameters
	* status : BadRequest 400, 
	* message : "Require parameters"
2. **E-A-002** - Missing body or wrong body dto
	* status : BadRequest 400, 
	* message : "Require body and customized dto of current route"

3. **E-A-010 -** Search with too large limit
	* status : NotAccepted 406,
	* message : "Cannot search with the limit greater than ${maxLimit}"

4. **E-A-011** - Search with less than zero limit
	* status : NotAccepted 406,
	* message : "Cannot search with limit less than ${minLimit}"

5. **E-A-100** - Detected wrong form of prevOrderId field on OrderTable
	* status : NotAccepted 406
	* message : "Wrong form of prevOrderId field on OrderTable detected, its length should be exactly 2"

6. **E-A-900** - Failed to generate a bearer token
	* status : InternalServerError 500
	* message : "Failed to generate a bearer token for current user"

7. **E-A-901** - Failed to generate a auth code
	* status : InternalServerError 500
	* message : "Failed to generate a auth code for current user"

8. **E-A-902** - Failed to send a email for validation
	* status : InternalServerError 500
	* message : "Failed to send a email for validation"

10. **E-A-999** - Unknown API error : 
	* status : Unknown Error 520
	* message : "Unknown error occurred"