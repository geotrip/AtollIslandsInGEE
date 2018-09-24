// Select the year of the imagery. This just sets the year description in the output correctly.

var year ='2017';
print('Year: '+year);


// Select the image to be classified, and the true- colour image to use as a reference

var toClassify = n17
toClassify = toClassify.clip(roi);
Map.centerObject(roi)

// Add the composite images to the map

var ls7viz = {gamma: 2, bands: 'B3,B2,B1'};
//var ls8viz = {gamma: 2.1}

Map.addLayer(ps17.clip(roi), {gamma: 2.2}, 'ps17',false);
Map.addLayer(ps16.clip(roi), {gamma: 2.2}, 'ps16',false);
Map.addLayer(ps15.clip(roi), {gamma: 2.2}, 'ps15',false);
Map.addLayer(ps14.clip(roi), {gamma: 2.2}, 'ps14',false);

Map.addLayer(m1113.clip(roi), ls7viz, 'm1113',false);
Map.addLayer(m0710.clip(roi), ls7viz, 'm0710',false);
Map.addLayer(m0406.clip(roi), ls7viz, 'm0406',false);
Map.addLayer(m0203.clip(roi), ls7viz, 'm0203',false);
Map.addLayer(m9901.clip(roi), ls7viz, 'm9901',false);


// Produce median images to sample from
var NDmedian= ee.ImageCollection([
    n9901,n0203,n0406,n0710,n1113,n14,n15,n16,n17
  ]).median()

var NDmedianL8= ee.ImageCollection([
  n14,n15,n16,n17
  ]).median()
  
var NDmedianL7= ee.ImageCollection([
    n9901,n0203,n0406,n0710,n1113
  ]).median()
  
// Sample images using training samples
var training = NDmedian.sampleRegions({
	collection: Wt.merge(Sh),
	properties: ['class'],
	scale: 30
});

var training2 = NDmedianL8.sampleRegions({
	collection: Vg.merge(Urb),
	properties: ['class'],
	scale: 30
});

// Combine required training samples into one combined sample set
var join = training.merge(training2)

// Select the classifier
var classifier = ee.Classifier.svm();

// Train the chosen classifier 
var fullClassifier = classifier.train({
  features:join, 
  classProperty: 'class', 
  inputProperties: ['R1', 'R2', 'R3', 'R4', 'R5', 'R6', 'R7', 'R8', 'R9', 'R10', 'R11', 'R12', 'R13', 'R14', 'R15']
});

// Classify the images.
var classified = toClassify.classify(fullClassifier);



// Visualise the classification

// var colorbrewer = require('users/gena/packages:colorbrewer')
// var palette = colorbrewer.Palettes.Set2[4]

var palette = ['LIGHTSKYBLUE', 'DARKGREEN', 'LEMONCHIFFON','ORANGE'];

Map.addLayer(classified.clip(roi), {palette: palette, min: 0, max: 4},'classified '+year);



// Create AA points 
var aaPoints = classified.stratifiedSample({
  numPoints: 50, classBand: 'classification', region: roi, dropNulls: true, geometries: true})

Export.table.toDrive({collection: aaPoints, description:'aa_points', folder:'seperate_outputs', fileFormat :'SHP'})





// Print imported ground-truthed AA points
print(palau_aa)

// Sample the image to classified at the reference points
var testing = toClassify.sampleRegions({
	collection: palau_aa,
	properties: ['classifica'],
	scale: 30
});

// Classify the reference pixels using working trained classifier
var validation = testing.classify(fullClassifier);

// Compare the ground truth and the working classification via an error matrix 
var errorMatrix = validation.errorMatrix('classifica','classification');

// Print the accuracy results to the console
print('Confusion table:', errorMatrix);
print('Accuracy: (correct/total)', errorMatrix.accuracy());
print('Consumer\'s accuracy (comission) (across):', errorMatrix.consumersAccuracy());
print('Producer\'s accuracy (omission) (down):', errorMatrix.producersAccuracy());

// // Produce binary accuracy
// var binary = toClassify.remap([0,1,2,3,4],[0,1,1,0,1])
// Map.addLayer(binary,{max: 1, min: 0},'Binary')

// var binarySample = binary.sampleRegions({
// 	collection: bin,
// 	properties: ['classifica'],
// 	scale: 30
// });

// var errorMatrixBinary = binarySample.errorMatrix('class', 'remapped')
// print('Binary Accuracy:', errorMatrixBinary.accuracy());
// print('Binary Confusion table:', errorMatrixBinary);


// Export the classified result
Export.image.toAsset({
  image: classified, 
  description: year+'_palau_split_urb_veg_SVM_class',
  assetId: 'palau/class_splitGen/'+year+'_palau_split_urb_veg_class',
  region: roi.geometry().bounds(), 
  scale: 30, 
  maxPixels: 1e13,
  pyramidingPolicy: {".default": "mode"},
});