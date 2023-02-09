---
id: 2rfic0706phl86pmvjsz1c6
title: Fixing Event Flow
desc: ''
updated: 1675966546788
created: 1675960564149
---
1. Make list of variables.
2. Determine who needs to retrieve the variables and who needs to set the variables.
3. Diagram the flow so you make sure it will work.
4. Refactor to implement.

* RentalFilters
    * variables:
        * vacancyValues
        * regValue
        * rentValue
        * bedsValues
    * methods:
        * updateBeds
        * updateRent
        * updateVacancy
        * updateReg
    * uses:
        * unreg
        * calculateStats()
        * runFilters()
        * setUnreg()
        * filterPopup()
* RentalStats
    * variables:
        * ar
        * mnr
        * mxr
        * tu
    * methods:
    * uses:
        * unreg
        * avgRent
        * minRent
        * maxRent
        * totalUnits
        * totalUnregUnits
* PopupContent
    * variables:
        * sortStatus
        * records
    * uses:
        * popupAddress
        * popupUnits
* Map
    * variables:
        * opened
        * eventsSet
        * mapContainer
    * methods:
        * onPopupClose
    * uses:
        * map
        * mapFilter
        * popupAddress
        * calculateStats()
        * newPopup(event)
* MapContext
    * variables:
        * avgRent
        * minRent
        * maxRent
        * totalUnits
        * totalUnregUnits
        * unreg
        * popupUnits
        * Refs:
            * map
            * mapFilter
            * popupAddress
    * methods: 

* For rendering RentalStats:
    * avgRent
    * minRent
    * maxRent
    * totalUnits
    * totalUnregUnits
    * unreg
* For rendering RentalFilters:
    * unreg
    * vacancyValues
    * regValue
    * rentValue
    * bedsValues
* For rendering PopupContent:
    * sortStatus
    * records
    * popupUnits

* Who causes updates?
    * RentalFilters
    * Map

1. Make mapFilter a state again.
2. Make RentalFilters change the states (including via calling runFilters) but don't run any other functions like calculateStats or filterPopups.
3. Make runFilters change mapFilter but not run the filtering.
3. Write a useEffect() for mapContext that depends on mapFilter and runs the filtering
4. Write a useEffect() for mapContext that depends on mapFilter and unreg and calculates the stats... 
5. change it so it USES querySourceFeatures!!!