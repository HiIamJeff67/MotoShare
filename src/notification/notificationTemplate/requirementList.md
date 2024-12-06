## **Requirement list of notification**

# **Note :** if we notify both the passenger and the ridder, there should be two different notification template

* Expired purchaseOrders, supplyOrders

* Create PassengerInvite -> notify the ridder(receiver)
* Create RidderInvite -> notify the passenger(receiver)

* (Passenger) Update the info of his/her PassengerInvite -> notify the ridder(receiver)
* (Ridder) Update the info of his/her RidderInvite -> notify the passenger(receiver)

* (Passenger) Cancel his/her PassengerInvite -> notify the ridder(receiver)
* (Ridder) Cancel his/her RidderInvite -> notify the passenger(receiver)

* (Ridder) Accept the PassengerInvite -> notify the passenger(inviter)
* (Passenger) Accept the RidderInvite -> notify the ridder(inviter)

* (Ridder) Reject the PassengerInvite -> notify the passenger(inviter)
* (Passenger) Reject the RidderInvite -> notify the ridder(inviter)

* Change on the status of Order -> notify both the passenger and the ridder

* (Passenger) Rate the History -> notify both the passenger and the ridder
* (Ridder) Rate the History -> notify both the ridder and the passenger

* (Passenger) Comment the History -> notify both the passenger and the ridder
* (Ridder) Comment the History -> notify both the ridder and the passenger