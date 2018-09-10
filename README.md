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

Accordingly, I set out to develop an approach to monitoring atoll island land area which operated at the global scale. Key to this was using the freely available Google Earth Engine (GEE) [(access at https://earthengine.google.com/signup/)](https://earthengine.google.com/signup/), a platform for geospatial analysis that allows users to harness cloud-based super-computing to dramatically increase the scale at which research may be undertaken. The GEE catalog contains a vast amount of data which constantly being expanded and refined. Critically, the majority of the current Landsat archive is available for use within GEE.

<a name="data"></a>
## Creating composite images

Anyone who has attempted passive satellite based remote sensing in the tropics will have struck the same issue: clouds. Given the footprint of a single Landsat scene is some 185 by 180 km, at the latitudes in which coral reefs occur having a cloud free image is the exception rather than the rule. Clouds are the enemy and would need to be removed before any approach to automate island detection could be successfully implemented within GEE.

To solve this issue, all available scenes captured within a given year within the targeted region collated. These scenes were cloud masked (using the QA band and FMask) and the the median value of the remaining pixels was used to create a complete, cloud-free composite image.

There were a number of challenges to overcome for this approach to work effectively. The bright coral sands common to atoll islands were often mistaken for cloud by QA and band, leaving gaps in the final composite which required filling with the unmasked pixel with the lowest (darkest) reflectance. Likewise, the failure of the Landsat-7 scan line corrector (SLC) necessitated the use of scenes captured within a timespan of multiple years for enough data to be avaiable to create a complete composite image.

<a name="class"></a>
## Composite classification
