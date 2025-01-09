1. **E-C-001** - Invalid bearer token or bearer token expired (user without validation)
	* status : Unauthorized 401
	* message : "Invalid user, or token expired"

2. **E-C-002** - Missing bearer token (user without validation)
	* status : Unauthorized 401
	* message : "Unauthorized" (default by JwtGuard)

3. **E-C-003** - The current user has no access to this method
	* status : Unauthorized 401
	* message : "The current user has no access to this method"

4. **E-C-004** - The Length of userName is invalid
	* status : BadRequest 400
	* message : \["E-C-004"\] ( The userName must be longer than 3 and shorter than 20 characters )

5. **E-C-005** - The form of userName is invalid
	* status : BadRequest 400
	* message : \["E-C-005"\] ( The userName must be lowercase or uppercase english letters or numbers )

6. **E-C-006** - The form of email is invalid
	* status : BadRequest 400
	* message : \["E-C-006"\] ( The email must be email )

7. **E-C-007** - The password is not strong enough
	* status : BadRequest 400
	* message : \["E-C-007"\] ( The password is not strong enough )

8. **E-C-010** - The authCode is not match
	* status : NotAcceptable 406
	* message : "The given authCode is not match"

9. **E-C-011** - The authCode expired
	* status : NotAcceptable 406
	* message : "The authCode has expired, please generate another one"

10. **E-C-012** - Cannot update new password due to the old password not matching
	* status : NotAcceptable 406
	* message : "Cannot update new password due to the old password not matching"

11. **E-C-013** - Cannot delete the account due to the given password not matching
	* status : NotAcceptable 406
	* message : "Cannot delete the account due to the given password not matching"

12. **E-C-014** - User without advance authorized cannot continue the services
	* status : Unauthorized 401
	* message : "The user cannot continue the services without email authenticated"

13. **E-C-015** - Cannot use this method to authenticate
	  * status : Unauthorized 401
	  * message : "The user cannot use this method to authenticate"

14. **E-C-016** - Invalid google id token
	* status : Unauthorized 401
	* message : "Invalid google id token detected"

15. **E-C-017** - User without default authenticated cannot continue the services
	* status : Unauthorized 401
	* message : "The user cannot continue the services without default authenticated"

16. **E-C-018** - User without google authenticated cannot continue the services
	* status : Unauthorized 401
	* message : "The user cannot continue the services without google authenticated"

18. **E-C-100** - Can not find any passengers
	* status : NotFound 404
	* message : "Cannot find any users"

19. **E-C-101** - Can not find any ridders
	* status : NotFound 404
	* message : "Cannot find any ridders"

20. **E-C-102** - Can not find any invites
	 * status : NotFound 404
	 * message : "Cannot find any invites"

21. **E-C-103** - Can not find any purchaseOrders
	* status : NotFound 404
	* message : "Cannot find any purchaseOrders"

22. **E-C-104** - Can not find any supplyOrders
	* status: NotFound 404
	* message : "Cannot find any supplyOrders"

23. **E-C-105** - Can not find any orders
	* status : NotFound 404
	* message : "Cannot find any orders"

24. **E-C-106** : Can not find any collections
	* status : NotFound 404
	* message : "Cannot find any collections"

25. **E-C-107** - Failed to sign in, userName not found
	* status : NotFound 404
	* message : "Failed to sign in, userName not found"

26. **E-C-108** - Failed to sign in, email not match
	* status : NotFound 404
	* message : "Failed to sign in, email not found"

27. **E-C-109** - Failed to find any histories
	* status : NotFound 404
	* message : "Failed to find any histories"

28. **E-C-110** - Failed to find any passengerNotifications
	* status : NotFound 404
	* message : "Failed to find any passengerNotifications"

29. **E-C-111** - Failed to find any ridderNotifications
	* status : NotFound 404
	* message : "Failed to find any ridderNotifications"

30. **E-C-112** - Failed to find any passengerPreferences
	* status : NotFound 404
	* message : "Failed to find any passengerPreferences"

31. **E-C-113** - Failed to find any ridderPreferences
	* status : NotFound 404
	* message : "Failed to find any ridderPreferences"

32. **E-C-114** - Failed to find any periodicPurchaseOrders
	* status : NotFound 404
	* message : "Failed to find any periodicPurchaseOrders"

33. **E-C-115** - Failed to find any periodicSupplyOrder
	* status : NotFound 404
	* message : "Failed to find any periodicSupplyOrders"

34. **E-C-116** - Failed to find any passengerRecord
	* status : NotFound 404
	* message : "Failed to find any passengerRecords"

35. **E-C-117** - Failed to find any ridderRecord
	* status : NotFound 404
	* message : "Failed to find any ridderRecords"

36. **E-C-118** - Failed to find any passengerAuth
	* status : NotFound 404
	* message : "Failed to find any passengerAuths"

37. **E-C-119** - Failed to find any ridderAuth
	* status : NotFound 404
	* message : "Failed to find any ridderAuths"

38. **E-C-120** - Failed to find any passengerBank
	* status : NotFound 404
	* message : "Failed to find any passengerBanks"

39. **E-C-121** - Failed to find any ridderBank
	* status : NotFound 404
	* message : "Failed to find any ridderBanks"

41. **E-C-201** - Failed to sign in
	* status : Forbidden 403
	* message : "Failed to sign in"

42. **E-C-202** - Failed to sign in, user with password not match
	* status : Forbidden 403
	* message : "Failed to sign in, user with password not match"

43. **E-C-203** - Failed to sign up
	* status : Forbidden 403
	* message : "Failed to sign up"

44. **E-C-204** - Duplicate userName or email detected 
	* **Note** : ( this is automatically generated by Neon, and since it route the entire database response in Http status code 500 and only gives me the error message, it's quite hard to do more custom detail stuff...)
	* status : Conflict 409
	* message : ... + {table_name} + "\_" + {duplicate_field} + "\_" + "unique"

45. **E-C-205** - Failed to create a purchaseOrder
	* status : Forbidden 403
	* message : "Failed to create a purchaseOrder"

46. **E-C-206** - Failed to create a supplyOrder
	* status : Forbidden 403
	* message : "Failed to create a supplyOrder"

47. **E-C-207** - Failed to create a passengerInvite
	* status : Forbidden 403
	* message : "Failed to create a passengerInvite"

48. **E-C-208** - Failed to create a ridderInvite
	* status : Forbidden 403
	* message : "Failed to create a ridderInvite"

49. **E-C-209** - Failed to create a order
	* status : Forbidden 403
	* message : "Failed to create an order"

50. **E-C-210** - Failed to create a passengerInfo
	* status : Forbidden 403
	* message : "Failed to create a passengerInfo"

51. **E-C-211** - Failed to create a ridderInfo
	* status : Forbidden 403
	* message : "Failed to create a ridderInfo"

52. **E-C-212** - Failed to create a passengerCollection
	* status : Forbidden 403
	* message : "Failed to create a passengerCollection"

53. **E-C-213** - Failed to create a ridderCollection
	* stauts : Forbidden 403
	* message : "Failed to create a ridderCollection"

54. **E-C-214** - Failed to create a history
	* status : Forbidden 403
	* message : "Failed to create a history"

55. **E-C-215** - Failed to create a passengerAuth
	* status : Forbidden 403
	* message : "Failed to create a passengerAuth"

56. **E-C-216** - Failed to create a ridderAuth
	* status : Forbidden 403
	* message : "Failed to create a ridderAuth"

57. **E-C-217** - Failed to create a passengerNotification
	* status : Forbidden 403
	* message : "Failed to create a passengerNotification"

58. **E-C-218** - Failed to create a ridderNotification
	* status : Forbidden 403
	* message : "Failed to create a ridderNotification"

59. **E-C-219** - Failed to create a passengerPreference
	* status : Forbidden 403
	* message : "Failed to create a passengerPreference"

60. **E-C-220** - Failed to create a ridderPreference
	* status : Forbidden 403
	* message : "Failed to create a ridderPreference"

61. **E-C-221** - Failed to create a periodicPurchaseOrder
	* status : Forbidden 403
	* message : "Failed to create a periodicPurchaseOrder"

62. **E-C-222** - Failed to create a periodicSupplyOrder
	* status : Forbidden 403
	* message : "Failed to create a periodicSupplyOrder"

63. **E-C-223** - Failed to create a passengerRecord
	* status : Forbidden 403
	* message : "Failed to create a passengerRecord"

64. **E-C-224** - Failed to create a ridderRecord
	* status : Forbidden 403
	* message : "Failed to create a ridderRecord"

65. **E-C-225** - Failed to store searchRecords
	* status : Forbidden 403
	* message : "Failed to store searchRecords"

66. **E-C-226** - Failed to maintain searchRecords
	* status : Forbidden 403
	* message : "Failed to maintain searchRecords"

67. **E-C-227** - Failed to calculate the average starRating of some passenger
	* status : Forbidden 403
	* message : "Failed to calculate the average starRating of some passenger"

68. **E-C-228** - Failed to calculate the average starRating of some ridder
	 * status : Forbidden 403
	* message : "Failed to calculate the average starRating of some ridder"

69. **E-C-229** - Failed to create a passengerBank
	* status : Forbidden 403
	* message : "Failed to create a passengerBank"

70. **E-C-230** - Failed to create a ridderBank
	* status : Forbidden 403
	* message : "Failed to create a ridderBank"

71. **E-C-300** - The userName doesn't change at all
	* status : Conflict 409
	* message : "There's no changes on userName"

72. **E-C-301** - The email doesn't change at all
	* status : Conflict 409
	* message : "There's no changes on email"

73. **E-C-302** - The password doesn't change at all
	* status : Conflict 409
	* message : "There's no changes on password"

74. **E-C-303** - The default auth has already bound
	* status : Conflict 409
	* message : "The current user has already bound his/her default authentication"

75. **E-C-304** - The google auth has already bound
	* status : Conflict 409
	* message : "The current user has already bound his/her google authentication"

76. **E-C-351** - The end time is earlier than the start time
	* status : Conflict 409
	* message : "The end time is earlier than the start time"

77. **E-C-352** - The size of uploaded file too large
	* status : NotAcceptable 406
	* message : "The size of uploaded file should be within {maxSize}{unit}"

78. **E-C-353** - Invalid mime type of uploaded file
	* status : NotAcceptable 406
	* message : "The (mime)type of uploaded file should be {validMimeType}"

79. **E-C-400** - Passenger's bank balance not enough
	* status : NotAcceptable 406
	* message : "Passenger doesn't have enough balance to pay"

80. **E-C-401** - Ridder's bank balance not enough
	* status : NotAcceptable 406
	* message : "Ridder doesn't have enough balance to pay"

81. **E-C-402** - Cannot pay due to wrong order status 
	* status : NotAcceptable 406
	* message : "Pay operation in Order not allowed, it is only allowed if the passengerStatus is UNPAID, or the ridderStatus is UNPAID"

81. **E-C-999** - Other
	* status : UnknownError 520
	* message : "Unknown error occurred"

