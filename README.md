# google-assistant
Google Assistant, Blood Bank

###Assistant: Blood Bank
It is a Real Time Collection of Blood Donors Informations in a perticular Area.
It is created with AIM of exchange of Information between Blood Seekers and Blood Donors for a Perticular area.


## What it Does..??
1. Blood Donors can register themselves as Donors in a Perticular area
2. Blood Seekers can search and contact Blood Donors for as per their requirements.

    
## Detailed Steps
1. The Code in this repo is for Google Firebase functions that are handling webhook calls. 
2. This Firebase Function is responsible for querying Database and getting relevant records.
3. Records are then filtered on Seeker's Blood Group and Area of Requirement.
4. Filtered results are then Added to Rich Cards for Enhanced user experience.
5. Response contains relevant Information provided by Blood Donor, directly to seeker.


## Misc:
1. The Project is using DialogFlow, Actions on Google, Firebase Functions and Firebase Real time Database.
2. Please Note all information Provided by Donor is Public for any needy to access, I hasn't setup any useless Authetication, considering various factors.

### :)


  

