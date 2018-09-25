/*This is the final LS7 code. It contains most of the tricks I picked up over the course of the year
when putting together Landsat composites. It should get you most of the way quality wise, but improvements
can be made by tweaking
*/


//Place name for naming the exports
var place = 'FSM';
var group = '';

var roi = fsm_roi//.filter(ee.Filter.lte('Id',16));

// Set the map view to center on the ROI. It may be easier to comment this out after the first time to avoid resetting each time the code is run.
Map.centerObject(roi);


// Map.addLayer(masknd.unmask())
//Select date 
var year = ['2003','2008'];
print(roi);

Map.addLayer(roi,{},'ROI');
var start = ee.Date(year[0]+'-01-01');
var end = ee.Date(year[1]+'-12-31');

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
// Apply fmask
function fmask(image) {
  return image.updateMask(image.select('fmask').lte(1));
}

// Only select the pixels labeled 'clear' in the quality band
var bqa = function(image) {
  return image.updateMask(image.select('BQA').eq(672));
};


var LS7fmaskcol =  ee.ImageCollection('LANDSAT/LE7_L1T_TOA_FMASK')
  .filterDate(start,end)
  .filterBounds(roi);
print(LS7fmaskcol)
print('Precollection TOA fmask size: ', LS7fmaskcol.size())

// T1 to account for newer imagery only being available within the new collection system
var ls7t1col = ee.ImageCollection('LANDSAT/LE07/C01/T1_RT_TOA') 
  .filterDate(start,end)
  .filterBounds(roi)
print('T1 size',ls7t1col.size());




// This just checks if the TOA fmask and the C01 T1 collections are the same size
var t1num = ee.List([ee.Number(ls7t1col.size())]);
var toafnum = ee.List([ee.Number(LS7fmaskcol.size())]);
print('Is the new collection T1 the same size\nas the toa fmask collection?: ',
t1num.equals(toafnum));


/*Builds a T2 collection. While they are supposedly meant to be lower quality, 
they are often just fine, with the registration accuracy in particular seemingly more 
senstive to the relative lack of registration points in areas with little land (atolls)
rather than actual offset*/
var ls7t2col = ee.ImageCollection('LANDSAT/LE07/C01/T2_TOA')
  .filterDate(start,end)
  .filterBounds(roi)
print(ls7t2col)
print('C1 T2 size: ',ls7t2col.size());


var fmaskFilt = LS7fmaskcol.map(fmask).select('B1','B2','B3','B4','B5','B7','B8');
var fmaskUnfilt = LS7fmaskcol.select('B1','B2','B3','B4','B5','B7','B8')
var medianFmasked = fmaskFilt.median().clip(roi).select('B1','B2','B3','B4','B5','B7','B8');
var t1Filt = ls7t1col.map(bqa).select('B1','B2','B3','B4','B5','B7','B8');
var t1Unfilt = ls7t1col.select('B1','B2','B3','B4','B5','B7','B8')
var t1median = t1Filt.median().clip(roi).select('B1','B2','B3','B4','B5','B7','B8');
var minUnmasked = ls7t1col.min().clip(roi).select('B1','B2','B3','B4','B5','B7','B8');
var t2Filt = ls7t2col.map(bqa).select('B1','B2','B3','B4','B5','B7','B8');
var t2Unfilt = ls7t2col.select('B1','B2','B3','B4','B5','B7','B8').median();
var t2min = ls7t2col.min().clip(roi).select('B1','B2','B3','B4','B5','B7','B8');
var t2median = t2Filt.median().clip(roi).select('B1','B2','B3','B4','B5','B7','B8');


var mergedFilt = ee.ImageCollection(t1Filt.merge(fmaskFilt))
print('merged, filtered T1 + Fmask TOA size: ',mergedFilt.size());

var mergedUnfilt = ee.ImageCollection(fmaskUnfilt.merge(t1Unfilt))
var mergedMedian = mergedFilt.median().clip(roi)
var mergedMin = mergedUnfilt.median().clip(roi)

//This code fills in gaps with the minimum unfiltered pixels. Cloud shadow will be present
var fillerMask = mergedMedian.unmask().updateMask((mergedMedian.mask()).not()).gt(0);
var filler = mergedMin.updateMask(fillerMask.not());
var t1inclMin = (mergedMedian.unmask().add(filler.unmask()))



// This code fills in gaps of the filtered t2 median with unfiltered t2 median pixels 
var fillerMask = t2median.unmask().updateMask((t2median.mask()).not()).gt(0);
//Map.addLayer(fillerMask)
var filler = t2Unfilt.updateMask(fillerMask.not());
var t2median = (t2median.unmask().add(filler.unmask()))

/* Clip out atolls by Id in which the T2 are better than the T1 results (swap T1 for T2).
They are filled in the next step */
mergedMedian = mergedMedian.clip(roi
.filter(ee.Filter.neq('Id',9))
.filter(ee.Filter.neq('Id',10))
.filter(ee.Filter.neq('Id',16))
)

// This code fills in gaps with the t2 median pixels 
var fillerMask = mergedMedian.unmask().updateMask((mergedMedian.mask()).not()).gt(0);
var filler = t2median.updateMask(fillerMask.not());
var final = (mergedMedian.unmask().add(filler.unmask()))

// // This code fills in gaps with the unfiltered t2 median pixels 
// var fillerMask = final.unmask().updateMask((final.mask()).not()).gt(0);
// var filler = t2Unfilt.updateMask(fillerMask.not());
// var final2 = (final.unmask().add(filler.unmask()))



// Use this to pull out single scenes which may provide superior results compared to a median reduction
var targetSingleScene = ls7t2col.filterBounds(roi.filter(ee.Filter.eq('Id',16))).sort('CLOUD_COVER')
var features = targetSingleScene.getInfo().features;
for (var i = 0; i < features.length; i++) {
  var feature = features[i];
  Map.addLayer(ee.Image(feature.id), {bands: 'B3,B2,B1', gamma: 2}, feature.id,false);
  //Map.addLayer(ee.Image(feature.id), {bands: 'BQA', min: 0, max: 65535}, feature.id+' BQA');
}
print(targetSingleScene)


// // Here the single good scene can be injected into the final composite

final = final.clip(roi
.filter(ee.Filter.neq('Id',16))
// .filter(ee.Filter.neq('Id',1))
// .filter(ee.Filter.neq('Id',2))
// .filter(ee.Filter.neq('Id',3))
//.filter(ee.Filter.neq('Id',4))
)




var good0 = ee.Image('LANDSAT/LE07/C01/T2_TOA/LE07_095055_20041130')
.select('B1','B2','B3','B4','B5','B7','B8').clip(roi.filter(ee.Filter.eq('Id',16)));

// var good1 = ee.Image('LANDSAT/LE07/C01/T2_TOA/LE07_106054_20030110')
// .select('B1','B2','B3','B4','B5','B7','B8').clip(roi.filter(ee.Filter.eq('Id',1)));

// var good2 = ee.Image('LANDSAT/LE07/C01/T2_TOA/LE07_107056_20020404')
// .select('B1','B2','B3','B4','B5','B7','B8').clip(roi.filter(ee.Filter.eq('Id',2)));

// var good3 = ee.Image('LANDSAT/LE07/C01/T2_TOA/LE07_107057_20030218')
// .select('B1','B2','B3','B4','B5','B7','B8').clip(good3);

// var good4 = ee.Image('LANDSAT/LE07/C01/T2_TOA/LE07_107057_20120517')
// .select('B1','B2','B3','B4','B5','B7','B8').clip(roi.filter(ee.Filter.eq('Id',4)));


final = ee.ImageCollection([final, good0]).max().clip(roi)



var ls7viz = {bands: 'B3,B2,B1', gamma: 2};
final = ee.ImageCollection([final]).max()
//Map.addLayer(t1median, ls7viz, 'ls7 t1 bqa median',false);
Map.addLayer(medianFmasked, ls7viz, 'ls7 TOA fmask',false);
Map.addLayer(mergedMin, ls7viz, 'unfiltered ls7 TOA fmask + T1 min',false);
Map.addLayer(mergedMedian, ls7viz, 'filtered ls7 TOA fmask + T1 median',false);
//Map.addLayer(minUnmasked, ls7viz, 'ls7 c1 t1 min',false);
Map.addLayer(t2median.clip(roi), ls7viz, 'ls7 t2 bqa median',false);
Map.addLayer(t2Unfilt.clip(roi), ls7viz, 'ls7 t2 median',false);
Map.addLayer(t1inclMin.clip(roi), ls7viz, 'merged filtered fmask + T1 median, GF with unfiltered min',false);
Map.addLayer(final.clip(roi), ls7viz, 'As below, GF with T2 median');



/*Select which composite to use for the output. This can used to get around issues where only T2 scenes
are available*/

var image = final.select(['B[1-5]','B7','B8']).clip(roi)//.geometry().difference(overallCloud0203))

Export.image.toAsset({
  image: image.select(['B[1-5]','B7']), 
  description: year[0]+year[1]+'_LS7_Full_median_'+place+'_clipped',
  assetId: place+'/full_composite/LS7_'+year[0]+year[1]+'_new_median_full_composite_'+place+'_clipped', 
  region: roi.geometry().bounds(), 
  scale: 30, 
  maxPixels: 1e13});


// Sharpen the HSV values with the B8 15m band to create a pan-sharpened image
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

// Convert the RGB bands to the HSV color space.
var hsv = image.select(['B3', 'B2', 'B1']).rgbToHsv();

//var sharpened = ee.Image.cat([hsv.select('hue'), hsv.select('saturation'), image.select('B8')]).hsvToRgb().multiply(255).uint8().clip(roi);
var sharpened = toPS(image)

Export.image.toAsset({
  image: sharpened, 
  description: year[0]+year[1]+'_new_median_PS_u8bit_'+place+'_clipped', 
  assetId: place+'/PS/LS7_'+year[0]+year[1]+'_new_median_PS_u8bit_'+place+'_clipped',
  region: roi.geometry().bounds(),
  scale: 15,
  maxPixels: 1e13});

Map.addLayer(sharpened,{gamma: 2.1},'pan-sharpened',false);

var nd = toNDSVLS7(image)
Export.image.toAsset({
  image: nd, 
  description: year[0]+year[1]+'_LS7_NDSV_'+place+'_clipped',
  assetId: place+'/NDSV/'+year[0]+year[1]+'_LS7_NDSV_new_'+place+'_clipped',
  region: roi.geometry().bounds(), 
  scale: 30, 
  maxPixels: 1e13
})



