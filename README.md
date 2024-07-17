# DWS
- nodeJS Dynamic Backend/Web Service
- In a actionSet json file, we can specify sequence of backend actions to perform.
- Each actions can be written in javascript and will run as an evaluation.

Google Doc: https://docs.google.com/document/d/1vl2GrTnTwKLs-oUqQW4TFw3l4XpspKzJeMP5cmeVG5I

Demo Site: https://dws-wbpk.onrender.com/api/TTS_wfaAppVer with POST
[Target Config GIT]: https://github.com/jturtler/dwsConfigs (PRIVATE)

Progress:
  1. Basic Setup Try - Create a running service in a port (3010), able to perform 'get'/'post'
  2. EndPoint Configuration - Run an endpoint with the actionSet configuration.  The endpoint actionSet configuration is located in [Target Config GIT]

  3. [CURRENT STEP] Configuration Update - When a config file in [Target Config GIT] gets changed, setUp webhook to refresh this data in DWS running service

  4. More Features: 
    - Reusabilty: From an action, call other endpoint/actionSets for increasing reusability
    - Database Services: Create (separate project) mongo service, Fhir service, postsql data service to connect
    - Configuration data load on demand vs preloading
    