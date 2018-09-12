# Measuring atoll island land area in Google Earth Engine

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
The included atolls were separated into 278 separate units via polygons produced in QGIS 3.0. The reasons for this were threefold: such geometries were required to spatially filter the available imagery to retrieve scenes which covered targeted areas; it allowed the composite images to be clipped, saving storage space and reducing the processing load by excluding unrequired pixels; finally, it permitted classified results to be separated as meaningful units. Each ROI was given an individual numerical ID, allowing specific features, or groups of features, to be included or excluded from the analysis. The ROI polygon can be uploaded as a GEE asset [(learn about that here)](https://developers.google.com/earth-engine/importing). The following code creates an ROI variable, adds to it the map view and centres the map screen on it. 

```javascript
//Select roi
var roi = fsm_roi_limit

//Add roi to the map. Using the inspector tab allows name and id to be verified by clicking.
Map.addLayer(roi,{},'ROI');

//Centre the map view on the ROI
Map.centerObject(roi)
```

Now that the ROI has been added, we can create an [image collection](https://developers.google.com/earth-engine/ic_creating) from which a composite image will be produced. Adding Landsat data (or any other sources within the EE catalog) is as simple as selecting it from the list add clicking import, or calling it directly in code, as I have done below for the T2 Landsat 8 TOA collection (this process is exactly the same for any other image collections, e.g. T1 TOA, T1 SR). 


### Spatial and temporal filtering
Obviously, we only want to create a composite of certain areas and within a certain date range - so the initial image collection, which contains every scene in that collection, will need to be filtered. Filtering an image collection by date is achieved by calling the filterDate method on your image collection. The method takes a start date and an end date. I was attempting to produce annual composites, so the code reads from a list of years, but you can just as easily manually write in dates in the 'YYYY-MM-DD' format instead.

Filtering spatially is simple as we have an ROI object already, but you may also do this manually by using a geometry drawn within GEE instead. Simply call the .filterBounds method on your image collection with the geometry or feature you want to use in brackets.

Once the image collection has been filtered, the collection is printed to the console, which allows it to easily be reviewed, with the metadata of the collection and each scene available. The size (number of scenes) of the collection post filtering is also printed for reference.

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


### Cloud masking
So now the ls8t2col variable contains all available scenes which were within the space and date range we specified. However, if we were to preform a reduction (combine all the scenes within the collection into one composite) the results would be very poor, like in the example below. 

![Cloudy](Images/cloudy.PNG "Cloud contaminated composites")

Anyone who has attempted passive satellite-based remote sensing in the tropics will have struck the same issue: clouds. Given the footprint of a single Landsat scene is some 185 by 180 km, at the latitudes in which coral reefs occur having a cloud free image is definitely the exception rather than the rule. Clouds are the enemy and would need to be removed before any approach to automate island detection could be successfully implemented within GEE.

To solve this issue, the cloudy pixels of every scene in the filtered collection were eliminated. This process, called cloud-masking, was achieved in GEE using the BQA band and Fmask appended to the Landsat scenes. Note that Fmask is only available in specific collections in the GEE catalog, and they are labelled as such, e.g. LANDSAT/LC8_L1T_TOA_FMASK.

BQA uses a bitwise system to flag pixels likely to have a range of issues such as cloud contamination. More information on this can be found [here](https://landsat.usgs.gov/qualityband). However, I found that only using pixels labelled as 'clear' worked well (I’m sure with more work this approach could be improved). 

```javascript
/*Eliminate pixels tagged as cloud by BQA - useful when less imagery is available, but does give worse results
compared to only selecting clear pixels (as below)*/
var bqa = function(image) {
  var qa = image.select('BQA');
  var mask = qa.bitwiseAnd(Math.pow(2, 12)).neq(1).and(qa.bitwiseAnd(Math.pow(2, 14)).neq(1)); 
  return image.updateMask(mask.not())
};

// Only select the pixels labeled 'clear' in the quality band
var bqa = function(image) {
  return image.mask(image.select('BQA').eq(2720));
};
```
Note that for landsat 7, the 'clear' value is different:

```javascript
var bqa = function(image) {
  return image.updateMask(image.select('BQA').eq(672));
};
```

Using Fmask is very simple, but the Fmask collections are being deprecated, so using BQA is the better long term approach. 

```javascript
// Apply Fmask
function fmask(image) {
  return image.updateMask(image.select('fmask').lte(1));
}
```
Here cloud-masking is implemented as a function, and needs to be called on the image collection in order to work. To do this for every single scene in the image collection, it needs to be [mapped](https://developers.google.com/earth-engine/ic_mapping) using the .map() function. The code below applies the BQA function to the ls8t2col collection. As we will no longer need the BQA band after the cloud filtering has been completed, this is a good time to eliminate bands you will not use. This can be done using the .select() function with a list of bands you want to keep, e.g. 'B1','B2','B3','B8'. Since the bands I wanted to keep are contiguous, I used the shorthand 'B[2-8]'.

```javascript
var t2Filt = ls8t2col
  .map(bqa)
  .select('B[2-8]');
```

Now that we have removed the cloudy pixels from each image in the collection, we can produce a composite image. To do this, the image collection needs to be converted into a single image. In GEE, going from multiple (an image collection) to single (a single composite) is achieved using a [reducer](https://developers.google.com/earth-engine/reducers_intro). There are reducers available for most aggregating statistics, such as mean, median, mode, min, max, standard deviation etc. I found median to provide the best results, with mean being more influenced by the extremes in pixel values contributed by cloud and cloud shadow that persisted through the masking process. Note that the composite is also clipped by the calling the .clip() method with the roi object used as the input geometry. This makes the output much easier to analyse, but does not speed up reduction process. Again, you can also clip images using a geometry drawn within GEE.

```javascript
var t2median = t2Filt
  .median()
  .clip(roi)
```


### Visualising results
To visualise the result, we need to add the composite to the map as a layer. This is done using the Map.addLayer() function. This function takes an image, an object containing visualization parameters (such as which bands to use, gamma and stretch etc.) and optionally a label and a flag to automatically turn the layer on or off (this can be useful if you have many layers, but only want GEE to process the one you are interested in at the time). 

```javascript
Map.addLayer(t2median, ls8viz, '{bands: 'B4,B3,B2', gamma: 2}', true);
```

If you are visualising a number of similar images, it can be cleaner to create a visualization parameter object and calling it for all instances, rather than repeating it for each Map.addLayer() call, as below.

```javascript
var ls8viz = {bands: 'B4,B3,B2', gamma: 2};

Map.addLayer(t2median, ls8viz, 'ls8 t2 bqa median',false);
Map.addLayer(t2Unfilt, ls8viz, 'ls8 t2 unfiltered median',false);
```

With cloud-masking and a median reduction, this T2 Landsat composite is looking far better.

![Good](Images/good.PNG "Cloud contaminated composites")


### Combining multiple image collections
Now it starts getting a bit more technical. While you may wish to use only one image collection in your workflow for the sake of simplicity, better results may be possible by combining multiple collections (i.e. T1, T2, masked and unmasked) to achieve maximum coverage and image quality. In the first code snippet the gaps in the filtered T2 collection (where there have been clouds detected for a pixel representing the same geographic location in every image in the collection) are filled by using an unfiltered median or min composite. This ensures no gaps persist, but the trade-off is that cloud artefacts may persist in the final composite.


```javascript
//This code fills in gaps of the filtered t2 median with unfiltered T2 median pixels 
var fillerMask = t2median.unmask().not();
var filler = t2Unfilt.updateMask(fillerMask);
var t2median = (t2median.unmask().add(filler.unmask()))
```

In the following snippet, individual atolls with poor T1 coverage can be excluded and replaced with the respective T2 version. 

```javascript
// Here is where the T1 results can be cut out and replaced with T2. Can give better results. 
ls8t1col = ls8t1col.clip(roi
.filter(ee.Filter.neq('Id',9))
.filter(ee.Filter.neq('Id',10))
)

// This code fills in gaps in the T1 composite with the T2 median pixels 
var fillerMask = medT1.unmask().not();
var filler = t2median.updateMask(fillerMask);
var final = (medT1.unmask().add(filler.unmask())).clip(roi)
```

### Pan-sharpening
Now that a final composite has been produced, any additional transformations can be undertaken such as pan-sharpening and band ratioing. [Pan-sharpening](https://developers.google.com/earth-engine/image_transforms) is easy to achieve, but make sure that the resulting sharpened image is exported at the resolution of the pan rather than multispectral bands. 

```javascript
// Convert the RGB bands to the HSV colour space.
var hsv = image.select(['B3', 'B2', 'B1']).rgbToHsv();

// Sharpen the HSV values with the 15 m pan band (B8) to create a pan-sharpened image
var sharpened = ee.Image.cat([hsv.select('hue'), hsv.select('saturation'), 
image.select('B8')])
  .hsvToRgb()
  .multiply(255)
  .uint8()
  .clip(roi);
```

This could also easily be rewritten as a function (here for Landsat 8):

```javascript
// Sharpen the HSV values with the 15 m pan band (B8) to create a pan-sharpened image
var toPS = function(image){
  // Convert the RGB bands to the HSV color space.
  var hsv = image.select(['B3', 'B2', 'B1']).rgbToHsv();
  var pan = image.select('B8')
  // Sharpen the HSV values with the B8 15m band to create a pan-sharpened image
  return ee.Image.cat([hsv.select('hue'), hsv.select('saturation'), pan])
    .hsvToRgb()
    .multiply(255)
    .uint8()
};

// Call the toPS function on an image
var sharpened = toPS(image)
```


### NDSV
Using the [normalised difference spectral vector (NDSV) approach](https://ieeexplore.ieee.org/document/6587128/) improved classification performance in this study. This involves producing a pseudo multispectral image from all possible unique band ratios. Here this includes all the 30 m resolution B, G, R, NIR, SWIR1 and SWIR2 bands, resulting in 15 band ratios. Band ratioing is a common practice within remote sensing, used to remove the radiometric influence of topography, or to provide a single value for quantitative analysis (e.g. NDVI). Below is a 1 band image of the 10th ratio, between B3 (red) and B4 (NIR).

![NDSV](Images/NDr10.png "R10 NDSV")


Note the implementation below renames the Landsat 8 bands to make blue B1, rather than coastal-aerosol. The Landsat 7 implementation also renames the bands, allowing the NDSV images produced using both sensors to be directly compared. Bands may be renamed using the .select() function: two lists of the same length are required as an argument, the first containing the bands you wish to select and the second the new band labels (in order). 

```javascript
var toNDSVLS8 = function(image){
image = image.select(
  ['B2', 'B3', 'B4', 'B5', 'B6', 'B7'],
  ['B1','B2', 'B3', 'B4', 'B5', 'B6']
  );
var ndsv = image.normalizedDifference(['B1','B2']).rename('R1');
ndsv = ndsv.addBands(image.normalizedDifference(['B1','B3']).rename('R2'));
ndsv = ndsv.addBands(image.normalizedDifference(['B1','B4']).rename('R3'));
ndsv = ndsv.addBands(image.normalizedDifference(['B1','B5']).rename('R4'));
ndsv = ndsv.addBands(image.normalizedDifference(['B1','B6']).rename('R5'));
ndsv = ndsv.addBands(image.normalizedDifference(['B2','B3']).rename('R6'));
ndsv = ndsv.addBands(image.normalizedDifference(['B2','B4']).rename('R7'));
ndsv = ndsv.addBands(image.normalizedDifference(['B2','B5']).rename('R8'));
ndsv = ndsv.addBands(image.normalizedDifference(['B2','B6']).rename('R9'));
ndsv = ndsv.addBands(image.normalizedDifference(['B3','B4']).rename('R10'));
ndsv = ndsv.addBands(image.normalizedDifference(['B3','B5']).rename('R11'));
ndsv = ndsv.addBands(image.normalizedDifference(['B3','B6']).rename('R12'));
ndsv = ndsv.addBands(image.normalizedDifference(['B4','B5']).rename('R13'));
ndsv = ndsv.addBands(image.normalizedDifference(['B4','B6']).rename('R14'));
ndsv = ndsv.addBands(image.normalizedDifference(['B5','B6']).rename('R15'));
return ndsv.clip(roi)
};
```

Landsat 7 implementation:

```javascript
var toNDSVLS7 = function(image){
image = image.select(
  ['B1','B2', 'B3', 'B4', 'B5', 'B7'],
  ['B1','B2', 'B3', 'B4', 'B5', 'B6']
  );
var ndsv = image.normalizedDifference(['B1','B2']).rename('R1');
ndsv = ndsv.addBands(image.normalizedDifference(['B1','B3']).rename('R2'));
ndsv = ndsv.addBands(image.normalizedDifference(['B1','B4']).rename('R3'));
ndsv = ndsv.addBands(image.normalizedDifference(['B1','B5']).rename('R4'));
ndsv = ndsv.addBands(image.normalizedDifference(['B1','B6']).rename('R5'));
ndsv = ndsv.addBands(image.normalizedDifference(['B2','B3']).rename('R6'));
ndsv = ndsv.addBands(image.normalizedDifference(['B2','B4']).rename('R7'));
ndsv = ndsv.addBands(image.normalizedDifference(['B2','B5']).rename('R8'));
ndsv = ndsv.addBands(image.normalizedDifference(['B2','B6']).rename('R9'));
ndsv = ndsv.addBands(image.normalizedDifference(['B3','B4']).rename('R10'));
ndsv = ndsv.addBands(image.normalizedDifference(['B3','B5']).rename('R11'));
ndsv = ndsv.addBands(image.normalizedDifference(['B3','B6']).rename('R12'));
ndsv = ndsv.addBands(image.normalizedDifference(['B4','B5']).rename('R13'));
ndsv = ndsv.addBands(image.normalizedDifference(['B4','B6']).rename('R14'));
ndsv = ndsv.addBands(image.normalizedDifference(['B5','B6']).rename('R15'));
return ndsv.clip(roi)
};
```

Also note that both the Landsat 8 and Landsat 7 NDSV code snippets are functions, and thus must be called on the image object (which contains the required bands) to produce an NDSV image. As this is generally done after your image collection has been reduced to a single image (i.e. your final composite) you do not need to use .map() (though you could if you wanted to apply NDSV to every image in a collection). Instead, it is simply called like so:

```javascript
var nd = toNDSVLS7(image)
```

### Image Export

Depending on the size of your study area and the number of scenes being reduced, it make take some considerable time for GEE to process the final composite. You may also notice that the composite takes a while to reload when the zoom level is changed - this is because GEE processes at the scale set by the zoom level - esentially a level in the [pyramid](https://developers.google.com/earth-engine/scale) approach common to many GIS platforms.

Any subsequent calculations that rely on the final composite will also be slow, since it will need to be computed beforehand. Some more complex calculations, such as classification, may not work at all, timing out or running over the GEE user memory limit. This issue becomes magnified when trying to deal with multiple composites covering different date ranges - clearly processing multiple composites within the same script would be difficult and highly inefficient. To address this issue, images and features that are created within GEE scripts may be exported as a GEE [asset](https://developers.google.com/earth-engine/exporting). After export, assets may be imported into a script from the assets tab (on the left of the window by default). Imported assets perform much better in complex calculations, as less processing needs to be done 'on the fly'. Both images and features may also be exported to the drive of the google account associated with GEE, allowing data produced in GEE to be used outside of it in the traditional matter. The following code snippet shows how the final composite (finalComp) is exported as a GEE asset. There are a few things to note here: the Export.image.toAsset() function takes a number of arguments, but not all are required, and some (such as scale) make others redundant. In cases like these, it can be easier to use curly brackets { } within the function brackets ( ). This allows the arguments to be specifically called by name and followed by : before answering the argument as normal. This can also make it clearer what each argument in a complex function is doing, improving readability.

```javascript
Export.image.toAsset({
  image: finalComp.select('B[2-7]'),
  description: year[0]+'_LS8_Full_median_'+place+'_clipped',
  assetId: place+'/full_composite/LS8_'+year[0]+'_new_median_full_composite_'+place+'_clipped', 
  region: roi.geometry().bounds(), 
  scale: 30, 
  maxPixels: 1e13});
```

A couple of these arguments warrant further discussion. The description and assetId arguments are strings (i.e. text), but you can concatenate variable values onto text using +. In this example the variables **place** and **year** are concatenated to save having to rewrite each when the area or timespan of the composite being generated is changed (these variables are defined at the top of the code, and the year variable was also used to define the time range during the temporal filtering of the image collection). 

The region is the geometry of the area you wish to export. Note that this needs to be a single polygon. If you use a multipolygon, the export will fail. An easy way to get around this issue is to either draw a polygon within GEE, or (as above) call the .geometry() and .bounds() methods (in that order) on an existing feature such as an roi polygon. The .geometry() function creates a geometry object from the feature coordinates, and .bounds() creates a single bounding box that contains all of the polygons that the feature may be comprised of. Note that if you do not specify this, it will default to the area of your map view at the time when the function is called (this can be useful when making figures).

The scale argument controls the resolution at which your asset will be exported at. This is important to specify, as by default it is set to 1000 m. In most cases this will be the native resolution of your imagery (in this case the multispectral bands of Landsat 8, which are 30 m. If pan-sharpened imagery was being exported instead, this should be set to 15 m). Note that higher resolutions will take up more of your 250 GB asset allowance for the same geographic area. Also note that going beyond the native resolution of your imagery is pointless (i.e. exporting Landsat 8 data at 1 m resolution).

Finally, the maxPixels argument does exactly what it says on the tin. You will get an error if you go above 1e8, in which case you will 
need to specify a higher limit using maxPixels. The current upper limit is 1e13. If this is still too low, consider using a coarser resolution, a more constrained region, or if using an existing region geometry, splitting it into smaller chunks.

<a name="class"></a>
## Composite classification

Now that the composite imagery has been generated and saved as assets, they can be classified. Classification involves using a special algorithim (a classifier) to determine which of a user defined group of classes each pixel is most likely to represent. In this case, decisions are based upon the spectral values of each pixel (per band) after the classifier has been trained using a labelled dataset of represenative pixels. For more information on classification within GEE, see this [GEE Classification video tutorial](https://developers.google.com/earth-engine/tutorials#classification).

### Creating training samples

### Sampling the image

### Training the classifier

### Visualising the classification

<a name="aa"></a>
## Accuracy assessment
