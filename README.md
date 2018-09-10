# Measuring atoll island land area change in Google Earth Engine

The scripts in this repo show how I used Google Earth Engine to measure atoll island land area change at a global scale.

## Table of Contents

- [Introduction](#intro)
- [Creating composite images](#data)
- [Composite classification](#class)
- [Accuracy assessment](#aa)


<a name="intro"></a>
## Introduction

The rationale behind this research was very simple.

- Due to effects of climate change (sea level rise, increase in storminess etc.) there is global concern surrounding the future persistence of atoll islands, which represent the only habitable land for nations such as Tokelau, Kiribati and the Marshall Islands.

- Despite this concern, there have been relatively few studies which have quantitatively assessed atoll island change to date, resulting in limited and fragmentary monitoring of island land area.

- To date, research has occurred at the scale of individual atolls or small numbers of proximate islands while generally utilizing only two or three observations. This limited scale is the result of the availability and cost of high resolution satellite and historic aerial imagery.

- The number of islands that may reasonably be covered is also limited by the time-consuming nature of the existing approach: the shoreline or accepted shoreline proxy of the island(s) in question is digitized from the high resolution imagery by hand using ArcMap, a tricky process that requires careful attention.

Accordingly, I set out to develop an approach to monitoring atoll island land area which operated at the global scale. Key to this was using the freely available Google Earth Engine (GEE) [(sign up here)](https://earthengine.google.com/signup/). GEE is a platform for geospatial analysis that allows users to harness cloud-based super-computing to dramatically increase the scale at which research may be undertaken. The GEE catalog contains a vast amount of data which constantly being expanded and refined. Critically, the majority of the current Landsat archive is available for use within GEE.

<a name="data"></a>
## Creating composite images
The included atolls were separated into 278 seperate units via polygons produced in QGIS 3.0. The reasons for this were threefold: such geometries were required to spatially filter the available imagery to retrieve scenes which covered targeted areas; it allowed the composite images to be clipped, saving storage space and reducing the processing load by excluding unrequired pixels; finally, it permitted classified results to be separated as meaningful units. Each ROI was given an individual numerical ID, allowing specific features, or groups of features, to be included or excluded from the analysis. The ROI polygon can be uploaded as a GEE asset [(learn about that here)](https://developers.google.com/earth-engine/importing). The following code creates an ROI variable, adds to it the map view and centres the map screen on it. 

```javascript
//Select roi
var roi = fsm_roi_limit

//Add roi to the map. Using the inspector tab allows name and id to be verified by clicking.
Map.addLayer(roi,{},'ROI');

//Center the map view on the ROI
Map.centerObject(roi)
```

Now that the ROI has been added, we can create an [image collection](https://developers.google.com/earth-engine/ic_creating) from which a composite image will be produced. Adding Landsat data (or any other sources within the EE catalog) is as simple as selecting it from the list add clicking import, or calling it directly in code, as I have done below for the T2 Landsat 8 TOA collection (this process is exactly the same for any other image collections, e.g. T1 TOA, T1 SR). Obviously, we only want to create a composite of certain areas and within a certain date range - so the inital image collection, which contains every scene in that collection, will need to be filtered. Filterining an image collection by date is acheived by calling the filterDate method on your image collection. The method takes a start date and an end date. I was attempting to produce annual composites, so the code reads from a list of years, but you can just as easily manually write in dates in the 'YYYY-MM-DD' format instead.

Filtering spatially is simple as we have an ROI object already, but you may also do this manually by using a geometry drawn within GEE instead. Simply call the .filterBounds method on your image collection with the geometry or feature you want to use in brackets.

Once the image collection has been filtered, the collection is printed to the console, which allows it to easily be reviewed, with the metadata of the collection and each scene availalbe. The size (number of scenes) of the collection post filtering is also printed for reference.

```javascript
//Select date 
var year = ['2014','2014']
print('Year: ',year[0])
var start = ee.Date(year[0]+'-01-01');
var end = ee.Date(year[1]+'-12-31');

var ls8t2col = ee.ImageCollection('LANDSAT/LC08/C01/T2_TOA')
  .filterDate(start,end)
  .filterBounds(roi)
print(ls8t2col)
print('C1 T2 size: ',ls8t2col.size());
```

So now the ls8t2col variable contains all avaialbe scenes which were within the space and date range we specified. However, if we were to preform a reduction (combine all the scenes within the collection into one composite) the results would be very poor. 

[Cloudy](AtollIslandsInGEE/Images/cloudy.PNG "Cloud contaminated composites")
![2010 vs 2015](https://github.com/brmagnuson/LandFallowingInEarthEngine/blob/master/Images/ClippedComparison.png "2010 vs 2015")

Anyone who has attempted passive satellite based remote sensing in the tropics will have struck the same issue: clouds. Given the footprint of a single Landsat scene is some 185 by 180 km, at the latitudes in which coral reefs occur having a cloud free image is the exception rather than the rule. Clouds are the enemy and would need to be removed before any approach to automate island detection could be successfully implemented within GEE.

To solve this issue, all available scenes captured within a given year within the targeted region collated. These scenes were cloud masked (using the QA band and FMask) and the the median value of the remaining pixels was used to create a complete, cloud-free composite image.

There were a number of challenges to overcome for this approach to work effectively. The bright coral sands common to atoll islands were often mistaken for cloud by QA and band, leaving gaps in the final composite which required filling with the unmasked pixel with the lowest (darkest) reflectance. Likewise, the failure of the Landsat-7 scan line corrector (SLC) necessitated the use of scenes captured within a timespan of multiple years for enough data to be avaiable to create a complete composite image.

<a name="class"></a>
## Composite classification
