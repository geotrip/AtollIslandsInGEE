//Center the ROI in the map view
Map.centerObject(roi)

var year = '20022003'
print('Year:', year)
var toProcess = s0203;


// Add the composites to the map to check if miss-classification was caused by cloud
Map.addLayer(m9901.clip(roi),{bands: 'B3,B2,B1',gamma: 2},'1999 to 2001');
Map.addLayer(m0203.clip(roi),{bands: 'B3,B2,B1',gamma: 2},'2002 to 2003');
Map.addLayer(m0406.clip(roi),{bands: 'B3,B2,B1',gamma: 2},'2004 to 2006');
Map.addLayer(m0710.clip(roi),{bands: 'B3,B2,B1',gamma: 2},'2007 to 2010');
Map.addLayer(m1113.clip(roi),{bands: 'B3,B2,B1',gamma: 2},'2011 to 2013');

Map.addLayer(ps14.clip(roi),{gamma: 2.2},'2014');
Map.addLayer(ps15.clip(roi),{gamma: 2.2},'2015');
Map.addLayer(ps16.clip(roi),{gamma: 2.2},'2016');
Map.addLayer(ps17.clip(roi),{gamma: 2.2},'2017');


// Add all the images together, remapping to avoid false-positives 
var total = 
    s9901.unmask().remap([0,1,3,4],[0,10,3,4])
.add(s0203.unmask().remap([0,1,3,4],[0,10,3,4]))
.add(s0406.unmask().remap([0,1,3,4],[0,10,3,4]))
.add(s0710.unmask().remap([0,1,3,4],[0,10,3,4]))
.add(s1113.unmask().remap([0,1,3,4],[0,10,3,4]))
.add(s14.unmask().remap([0,1,3,4],[0,10,3,4]))
.add(s15.unmask().remap([0,1,3,4],[0,10,3,4]))
.add(s16.unmask().remap([0,1,3,4],[0,10,3,4]))
.add(s17.unmask().remap([0,1,3,4],[0,10,3,4]));


// select from the total image pxiels likely to be cloud miss-classification
var waterMiss = total.eq(4).or(total.eq(3))

// set the value of those pixels to be 0
var cleaned = toProcess.multiply(waterMiss.subtract(1)).multiply(-1)

// clip and mask the cleaned classification to be consistent with the other images
cleaned = cleaned.clip(roi.geometry().difference(cloud0203));
cleaned = cleaned.mask(s16.neq(99))


// Visualise the pre and post cleaning classifications
var palette = ['LIGHTSKYBLUE', 'DARKGREEN', 'LEMONCHIFFON','ORANGE'];
Map.addLayer(toProcess,{palette: palette, min: 0, max: 4},'raw')
Map.addLayer(cleaned,{palette: palette, min: 0, max: 4},'cleaned')
Map.addLayer(total,{min: 0, max: 90},'Total',false)

// Export the cleaned result
Export.image.toAsset({
  image: cleaned, 
  description: year+'_palau_splitGen_CM',
  assetId: 'palau/splitGen_CM/'+year+'_palau_splitGen_CM',
  region: roi.geometry().bounds(), 
  scale: 30, 
  maxPixels: 1e13,
  pyramidingPolicy: {".default": "mode"}
});