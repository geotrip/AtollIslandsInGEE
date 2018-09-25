/*This is the final LS8 code. It contains most of the tricks I picked up over the course of the year
when putting together Landsat composites. It should get you most of the way quality wise, but improvements
can be made by tweaking
*/

//Place name for naming the exports
var place = 'FSM';
var group = '';

//Select roi
var roi = fsm_roi_limit

//Add roi to the map. Using the inspector tab allows name and id to be verified by clicking.
Map.addLayer(roi,{},'ROI');

//Center the map view on the ROI
Map.centerObject(roi)

// Select date 
var year = ['2014','2014']
print('Year: ',year[0])
print(roi)
var start = ee.Date(year[0]+'-01-01');
var end = ee.Date(year[1]+'-12-31');

// Generate NDSV image
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

// Apply fmask
function fmask(image) {
  return image.updateMask(image.select('fmask').lte(1));
}


/*Eliminate pixels tagged as cloud by BQA - useful when less imagery is available, but does give worse results
compared to only selecting clear pixels (as below)*/
// var bqa = function(image) {
//   var qa = image.select('BQA');
//   var mask = qa.bitwiseAnd(Math.pow(2, 12)).neq(1).and(qa.bitwiseAnd(Math.pow(2, 14)).neq(1)); 
//   return image.updateMask(mask.not())
// };

// Only select the pixels labeled 'clear' in the quality band
var bqa = function(image) {
  return image.mask(image.select('BQA').eq(2720));
};


var LS8fmaskcol =  ee.ImageCollection('LANDSAT/LC8_L1T_TOA_FMASK')
  .filterDate(start,end)
  .filterBounds(roi)
  //.filter(ee.Filter.neq('LANDSAT_SCENE_ID', 'LC81220482016022LGN00'));
print(LS8fmaskcol)
print('Precollection TOA fmask size: ', LS8fmaskcol.size())


/* T1 to account for newer imagery only being available within the new collection system.
RT ensures that the latest possible imagery is always being used*/
var ls8t1col = ee.ImageCollection('LANDSAT/LC08/C01/T1_RT_TOA') 
  .filterDate(start,end)
  .filterBounds(roi)
print('T1 size',ls8t1col.size());



/*Builds a T2 collection. While they are supposedly meant to be lower quality, 
they are often just fine, with the registration accuracy in particular seemingly more 
senstive to the relative lack of registration points in areas with little land (atolls)
rather than actual offset*/
var ls8t2col = ee.ImageCollection('LANDSAT/LC08/C01/T2_TOA')
  .filterDate(start,end)
  .filterBounds(roi)
print(ls8t2col)
print('C1 T2 size: ',ls8t2col.size());


// //Use this to pull out single scenes which may provide superior results compared to a median reduction
// var targetSingleScene = ls8t2col.filterBounds(roi.filter(ee.Filter.eq('Id',0))).sort('CLOUD_COVER')
// var features = targetSingleScene.getInfo().features;
// for (var i = 0; i < features.length; i++) {
//   var feature = features[i];
//   Map.addLayer(ee.Image(feature.id), {bands: 'B4,B3,B2', gamma: 2}, feature.id,false);
//   //Map.addLayer(ee.Image(feature.id), {bands: 'BQA', min: 0, max: 65535}, feature.id+' BQA');
// }
// print(targetSingleScene)


//var good = ee.Image('LANDSAT/LC08/C01/T2_TOA/LC08_119053_20150927').clip(geometry).select('B[2-8]');
//var good2 = ee.Image('LANDSAT/LC08/C01/T2_TOA/LC08_120052_20150411').clip(geometry2).select('B[2-8]');
//var good3 = ee.Image('LANDSAT/LC08/C01/T2_TOA/LC08_120052_20150310').clip(geometry3).select('B[2-8]');
//var good4 = ee.Image('LANDSAT/LC08/C01/T2_TOA/LC08_122048_20140422').clip(geometry4).select('B[2-8]');
//var good5 = ee.Image('LANDSAT/LC08/C01/T2_TOA/LC08_122048_20160122').clip(roi.filter(ee.Filter.eq('Id',8))).select('B[2-8]');


//Perform required filtering, collection reductions and band selection.
var fmaskFilt = LS8fmaskcol.map(fmask).select('B[2-8]');
var fmaskUnfilt = LS8fmaskcol.select('B[2-8]');
var medianFmasked = fmaskFilt.median().clip(roi).select('B[2-8]');
var t1Filt = ls8t1col.map(bqa).select('B[2-8]');
var t1Unfilt = ls8t1col.select('B[2-8]');
var t1median = t1Filt.median().clip(roi).select('B[2-8]');
var minUnmasked = ls8t1col.min().clip(roi).select('B[2-8]');
var t2Filt = ls8t2col.map(bqa).select('B[2-8]');
var t2Unfilt = ls8t2col.select('B[2-8]').median();
var t2min = ls8t2col.min().clip(roi).select('B[2-8]');
var t2median = t2Filt.median().clip(roi)


var mergedFilt = ee.ImageCollection(t1Filt.merge(fmaskFilt));
print('merged, filtered T1 + Fmask TOA size: ',mergedFilt.size());

var mergedUnfilt = ee.ImageCollection(fmaskUnfilt.merge(t1Unfilt))
var mergedMedian = mergedFilt.median().clip(roi)
var mergedUnfilt = mergedUnfilt.median().clip(roi)

//This code fills in gaps with the median (or minimum) unfiltered pixels 
var fillerMask = mergedMedian.unmask().not();
var filler = mergedUnfilt.updateMask(fillerMask);
var medT1 = (mergedMedian.unmask().add(filler.unmask()))

//use this to skip the t1 unfiltered fill (can give better results)
//var medT1 = mergedMedian


// Here is where the T1 results can be cut out and replaced with T2. Can give better results. 
Map.addLayer(medT1, ls8viz, 'filtered ls8 TOA fmask + T1 median, GF with unfilt T1 median',false);

// // This code fills in gaps of the filtered t2 median with unfiltered t2 median pixels 
var fillerMask = t2median.unmask().not();
var filler = t2Unfilt.updateMask(fillerMask);
var t2median = (t2median.unmask().add(filler.unmask())).clip(roi)


/* Clip out atolls by Id in which the T2 are better than the T1 results (swap T1 for T2).
They are filled in the next step */
medT1 = medT1.clip(roi
.filter(ee.Filter.neq('Id',9))
.filter(ee.Filter.neq('Id',10))
.filter(ee.Filter.neq('Id',11))
)

// This code fills in gaps with the t2 median pixels 
var fillerMask = medT1.unmask().not();
var filler = t2median.updateMask(fillerMask);
var final = (medT1.unmask().add(filler.unmask())).clip(roi)

//This code fills in gaps in the composite with a manually generated good sub composite
// var fillerMask = final.unmask().not();
// var filler = good.updateMask(fillerMask);
// var final2 = ee.ImageCollection([final]).max()

var ls8viz = {bands: 'B4,B3,B2', gamma: 2};

Map.addLayer(ls8t2col.mean().clip(roi),ls8viz, 'ls8 t2 mean nofilt',false)
Map.addLayer(t1median, ls8viz, 'ls8 t1 bqa median',false);
Map.addLayer(medianFmasked, ls8viz, 'ls8 TOA fmask',false);
Map.addLayer(mergedUnfilt, ls8viz, 'unfiltered ls8 TOA fmask + unfilt T1 median',false);
Map.addLayer(mergedMedian, ls8viz, 'filtered ls8 TOA fmask + T1 median',false);
Map.addLayer(t2median, ls8viz, 'ls8 t2 bqa median',false);
Map.addLayer(t2Unfilt, ls8viz, 'ls8 t2 unfiltered median',false);
Map.addLayer(medT1, ls8viz, 'merged filtered fmask + T1 median, GF with unfiltered min',false);
Map.addLayer(final, ls8viz, 'As below, GF with T2 median (final)');
//Map.addLayer(final2, ls8viz, 'As below, GF with T2 median (final2)');


/*Select which composite to use for the output. This can used to get around issues where only T2 scenes
are available*/
var image = final//.clip(roi.filter(ee.Filter.eq('Id',24)))

// Export the composite
Export.image.toAsset({
  image: image.select('B[2-7]'),
  description: year[0]+'_LS8_Full_median_'+place+'_clipped',
  assetId: place+'/full_composite/LS8_'+year[0]+'_new_median_full_composite_'+place+'_clipped', 
  region: roi.geometry().bounds(), 
  scale: 30, 
  maxPixels: 1e13});


// Convert the RGB bands to the HSV color space.
var hsv = image.select(['B4', 'B3', 'B2']).rgbToHsv();

// Sharpen the HSV values with the B8 15m band to create a pan-sharpened image
var sharpened = ee.Image.cat([hsv.select('hue'), hsv.select('saturation'), image.select('B8')]).hsvToRgb().multiply(255).uint8().clip(roi);

Export.image.toAsset({
  image: sharpened, 
  description: year[0]+'_new_median_PS_u8bit_'+place+'_clipped', 
  assetId: place+'/PS/LS8_'+year[0]+'_new_median_PS_u8bit_'+place+'_clipped',
  region: roi.geometry().bounds(),
  scale: 15,
  maxPixels: 1e13});

Map.addLayer(sharpened,{gamma: 2.1},'pan-sharpened',false);

var nd = toNDSVLS8(image)
Export.image.toAsset({
  image: nd, 
  description: year[0]+'_LS8_NDSV_'+place+'_clipped',
  assetId: place+'/NDSV/'+year[0]+'_LS8_NDSV_'+place+'_clipped',
  region: roi.geometry().bounds(), 
  scale: 30, 
  maxPixels: 1e13
});