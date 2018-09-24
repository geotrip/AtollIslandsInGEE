// // Incase of gaps, fill with reverse mask
// r9901 = r9901.mask(r17.neq(99))
// r0203 = r0203.mask(r17.neq(99))
// r0406 = r0406.mask(r17.neq(99))
// r0708 = r0708.mask(r17.neq(99))
// r0911 = r0911.mask(r17.neq(99))
// r1213 = r1213.mask(r17.neq(99))

//Filter to a particular atoll
//roi = roi.filter(ee.Filter.eq('Id',6));
Map.addLayer(roi,{},'ROI')
Map.centerObject(roi)
print(roi)


// Visualise classifications and composites

var palette = ['LIGHTSKYBLUE', 'DARKGREEN',  'SILVER', 'LEMONCHIFFON','ORANGE'];

Map.addLayer(s9901.clip(roi),{min: 0, max: 4, palette: palette},'1999 to 2001 Classified');
Map.addLayer(s0203.clip(roi),{min: 0, max: 4, palette: palette},'2002 to 2003 Classified');
Map.addLayer(s0406.clip(roi),{min: 0, max: 4, palette: palette},'2004 to 2006 Classified');
Map.addLayer(s0710.clip(roi),{min: 0, max: 4, palette: palette},'2007 to 2010 Classified');
Map.addLayer(s1113.clip(roi),{min: 0, max: 4, palette: palette},'2011 to 2013 Classified');

Map.addLayer(s14.clip(roi),{min: 0, max: 4, palette: palette},'2014 Classified');
Map.addLayer(s15.clip(roi),{min: 0, max: 4, palette: palette},'2015 Classified');
Map.addLayer(s16.clip(roi),{min: 0, max: 4, palette: palette},'2016 Classified');
Map.addLayer(s17.clip(roi),{min: 0, max: 4, palette: palette},'2017 Classified');

Map.addLayer(m9901.clip(roi),{gamma: 2, bands: 'B3,B2,B1'},'9901');
Map.addLayer(m0203.clip(roi),{gamma: 2, bands: 'B3,B2,B1'},'0203');
Map.addLayer(m0406.clip(roi),{gamma: 2, bands: 'B3,B2,B1'},'0406');
Map.addLayer(m0710.clip(roi),{gamma: 2, bands: 'B3,B2,B1'},'0710');
Map.addLayer(m1113.clip(roi),{gamma: 2, bands: 'B3,B2,B1'},'1113');

Map.addLayer(ps14.clip(roi),{gamma: 2.2},'2014 PS');
Map.addLayer(ps15.clip(roi),{gamma: 2.2},'2015 PS');
Map.addLayer(ps16.clip(roi),{gamma: 2.2},'2016 PS');
Map.addLayer(ps17.clip(roi),{gamma: 2.2},'2017 PS');


// Function to generate per-class area values
var defineArea = function(image){
  // Create an image where the pixel value is equivalent to the area of that pixel
  var areaImageSqM = ee.Image.pixelArea().clip(roi);
  // Create a dictionary (a list of lists) to store the result in
  var result = ee.Dictionary()
    // Loop through the classes. i <= the number of classes in the classification
    for(var i = 0; i <= 4; i++) {
      var bin = image.eq(i)
      // Perform the multiplication
      var area = bin.multiply(areaImageSqM)
      // Calculate the sum
      area = area.reduceRegion({reducer: ee.Reducer.sum(),
        geometry: roi,
        scale: 30,
        maxPixels: 1e13
      });
      // Store the area result (converted from m2 to km2) in a dictionary per class.
      var answer =  ee.Dictionary([(''+i), (ee.Number(area.get('classification')).divide(1e6))]);
      // Combine the answers into the result dictionairy
      result = result.combine(answer);
    }
    // Sum the pixels representing land classes and add it to the result dicationary as 'total'
    var total = ee.Number(result.get('1')).add(result.get('2')).add(result.get('4'))
    return result.combine(['total_land',total]);
};


// Call area function on all classifications
// LS7
var area9901 = defineArea(s9901);
var area0203 = defineArea(s0203);
var area0406 = defineArea(s0406);
var area0710 = defineArea(s0710);
var area1113 = defineArea(s1113);

// LS8
var area14 = defineArea(s14);
var area15 = defineArea(s15);
var area16 = defineArea(s16);
var area17 = defineArea(s17);


// Create lists for plotting
var vegGraph = [area9901.get('1'), area0203.get('1'), area0406.get('1'), area0710.get('1'), area1113.get('1'), area14.get('1'), area15.get('1'), area16.get('1'), area17.get('1')];

var urbanGraph = [area9901.get('4'), area0203.get('4'), area0406.get('4'), area0710.get('4'), area1113.get('4'), area14.get('4'), area15.get('4'), area16.get('4'), area17.get('4')];

var totalGraph = [area9901.get('total_land'), area0203.get('total_land'), area0406.get('total_land'), area0710.get('total_land'), area1113.get('total_land'), area14.get('total_land'), area15.get('total_land'), area16.get('total_land'), area17.get('total_land')];

var xValues = [2000,2002.5,2005,2008.5,2012,2014,2015,2016,2017]
var yValues = ee.Array.cat([vegGraph, urbanGraph, totalGraph], 1);
var chart = ui.Chart.array.values(yValues, 0, xValues)
    .setChartType('ScatterChart')
    .setChartType('LineChart')//I don't know why it needed both to show lines rather than just points
    .setSeriesNames(['Vegetated','Urban','Total Land'])
    .setOptions({
      title: 'Areal Trajectory from '+xValues[0]+' to 2017',
      hAxis: {'title': 'Year'},
      vAxis: {'title': 'Area (km2)'},
      pointSize: 3,
      series: {
            0: {color: 'DARKGREEN'}, // veg
            1: {color: 'ORANGE'}, // Urban
            2: {color: 'BLACK'}  // total
}});

// Print the chart.
print(chart);


// Function to generate land area per polygon/atoll
var sepArea = function(image,id){
      var roiClipped = roi.filter(ee.Filter.eq('Id',id))
      var areaImageSqM = ee.Image.pixelArea().clip(roiClipped)
      // select pixels which are classified as one of the land classes
      image = (image.eq(1).or(image.eq(2)).or(image.eq(4))).clip(roiClipped)
      var area = image.multiply(areaImageSqM)
      area = area.reduceRegion({reducer: ee.Reducer.sum(),
        geometry: roiClipped.geometry(),
        scale: 30,
        maxPixels: 1e13
      });
    // Return a dictionary with the area values
    return ee.Dictionary([(''+i), (ee.Number(area.get('classification')).divide(1e6))]);
}; 

var year = '2017'
var result = ee.Dictionary();
// set < i to the number of atolls/polygons in the ROI. For some reason roi.size() does not work here
for(var i = 0; i <= 6; i++) {
  result = result.combine(sepArea(s17,i))
}
print(result)


//Export per atoll total land stats 
Export.table.toDrive({
  collection: ee.FeatureCollection(ee.Feature(null,result)),
  description: 'seperated_new_palau_'+year, 
  folder: 'palau'
});
