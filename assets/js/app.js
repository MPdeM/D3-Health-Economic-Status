var svgWidth = 600;
var svgHeight = 500;

var margin = {
  top: 10,
  right: 10,
  bottom: 10,
  left: 10
};
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;
// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // Initial Params  
  var chosenXAxis = "poverty";
  var chosenYAxis = "healthcare";

  
// function used for updating x-scale var upon click on axis label
function xScale(data, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(data, d => d[chosenXAxis]) * 0.8,
      d3.max(data, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, width]);
  return xLinearScale;
}
// function used for updating y-scale var upon click on axis label
function yScale(data, chosenYAxis) {
    // create scales
    var yLinearScale = d3.scaleLinear()
      .domain([d3.min(data, d => d[chosenYAxis]) * 0.8,
        d3.max(data, d => d[chosenYAxis]) * 1.2
      ])
      .range([0, width]);
    return yLinearScale;
  }


// function used for updating xAxis var upon click on axis label
function renderXAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
  
    xAxis.transition()
      .duration(1000)
      .call(bottomAxis);
  
    return xAxis;
  }
// function used for updating yAxis var upon click on axis label
function renderYAxes(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);
    yAxis.transition()
      .duration(1000)
      .call(leftAxis);
    return yAxis;
  }  

// XXXXXXXXXXXXXfunction used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, chosenXaxis) {

    circlesGroup.transition()
      .duration(1000)
      .attr("cx", d => newXScale(d[chosenXAxis]));
  
    return circlesGroup;
  }
// XXXXXXXXXXXfunction used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {
    if (chosenXAxis === "poverty") {
      var label = "Poverty %:";
    }
    else if (choosenXAxis === "age") {
      var label = "age";
    }
    else {
        var label = "income";
      }
  
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.abbr}`);
      });
  
    circlesGroup.call(toolTip);
  
    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data);
    })
      // on mouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });
  
    return circlesGroup;
  }  
//   xxxxxxxxxxxxxxxx
// Retrieve data from the CSV file and execute everything below
d3.csv("../assets/data/data.csv").then(function(data, err) {
    if (err) throw err;
  
    // parse data
    data.forEach(function(data) {
      data.poverty = +data.poverty;
      data.age = +data.age;
      data.income = +data.income;
      data.healthcare = +data.healthcare;
      data.obesity = +data.obesity;
      data.smokes = +data.smokes;
    });
    
  // xLinearScale function above csv import  XXXXXXXXXXXXXXXXXXXXXXXXXX
  var xLinearScale = xScale(data, chosenXAxis);

  // Create y scale function
  var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.healthcare)])
    .range([height, 0]);


  // Create initial axis functions

  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);
  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append y axis
  chartGroup.append("g").call(leftAxis);
    // append initial circles
    var circlesGroup = chartGroup.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    // xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[choosenYAxis]))
    .attr("r", 20)
    .attr("fill", "pink")
    .attr("opacity", ".5");

    // Create group for  3 x- axis labels
  var labelsXGroup = chartXGroup.append("g")
  .attr("transform", `translate(${width / 2}, ${height + 20})`);
  
  var povertyLabel = labelsXGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty") // value to grab for event listener XXXXXXXXXXXXXXXXX
    .classed("active", true)
    .text("% Population Below Poverty Level");

    var ageLabel = labelsXGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "age") // value to grab for event listener  XXXXXXX
    .classed("inactive", true)
    .text("Mean   Age   (years)");  
    
    var incomeLabel = labelsXGroup.append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "income") // value to grab for event listener  XXXXXXX
    .classed("inactive", true)
    .text("Mean Houshold Income ($)");
    
    // Create group for  3 y- axis labels
  var labelsYGroup = chartYGroup.append("g")
  .attr("transform", "rotate(-90)");

    var healthcareLabel = labelsYGroup.append("text")
    .attr("x", 0 - margin.left + 40)
    .attr("y", 0 - (height / 2))
    .attr("value", "healthcare") // value to grab for event listener XXXXXXXXXXXXXXXXX
    .classed("active", true)
    .text("% Population Without Healthcare");

    var smokersLabel = labelsYGroup.append("text")
    .attr("x", 0 - margin.left + 20)
    .attr("y", 0 - (height / 2))
    .attr("value", "smokes") // value to grab for event listener  XXXXXXX
    .classed("inactive", true)
    .text("% Smoking Population");  
    
    var obesityLabel = labelsYGroup.append("text")
    .attr("x", 0 - margin.left + 0)
    .attr("y", 0 - (height / 2))
    .attr("value", "obesity") // value to grab for event listener  XXXXXXX
    .classed("inactive", true)
    .text("% Obese Population");

    // updateToolTip function above csv import  XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
  var circlesGroup = updateToolTip(chosenXAxis, choosenYAxis, circlesGroup);
   
  // x axis labels event listener
    labelsXGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenXAxis) {
            // replaces chosenXaxis with value
            chosenXAxis = value;
            // console.log(chosenXAxis)
            // functions here found above csv import
            // updates x scale for new data
            xLinearScale = xScale(data, chosenXAxis);
            // updates x axis with transition
            xAxis = renderAxes(xLinearScale, xAxis);
            // updates circles with new x values
            circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);
            // updates tooltips with new info
            circlesGroup = updateToolTip(chosenXAxis, circlesGroup);
            // changes classes to change bold text
            if (chosenXAxis === "poverty") {
            povertyLabel
                .classed("active", true)
                .classed("inactive", false);
            ageLabel
                .classed("active", false)
                .classed("inactive", true);
            householdLabel
                .classed("active", false)
                .classed("inactive", true); 
            }
            else if (chosenXaxis === age) {
                povertyLabel
                .classed("active", false)
                .classed("inactive", true);
            ageLabel
                .classed("active", true)
                .classed("inactive", false);
            householdLabel
                .classed("active", false)
                .classed("inactive", true); 
            }
            else {
                povertyLabel
                .classed("active", false)
                .classed("inactive", true);
            ageLabel
                .classed("active", false)
                .classed("inactive", true);
            householdLabel
                .classed("active", true)
                .classed("inactive", false); 
            }
         }
    });

    // y axis labels event listener
    labelsYGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenYAxis) {
            // replaces chosenXaxis with value
            chosenYAxis = value;
            // console.log(chosenYAxis)
            // functions here found above csv import
            // updates y scale for new data
            yLinearScale = yScale(data, chosenYAxis);
            // updates x axis with transition
            yAxis = renderAxes(yLinearScale, yAxis);
            // updates circles with new x values
            circlesGroup = renderCircles(circlesGroup, yLinearScale, chosenYAxis);
            // updates tooltips with new info
            circlesGroup = updateToolTip(chosenYAxis, circlesGroup);
            // changes classes to change bold text
            if (chosenYAxis === "healthcare") {
            healthcareLabel
                .classed("active", true)
                .classed("inactive", false);
            smokersLabel
                .classed("active", false)
                .classed("inactive", true);
            obesityLabel
                .classed("active", false)
                .classed("inactive", true); 
            }
            else if (chosenXaxis === age) {
            healthcareLabell
                .classed("active", false)
                .classed("inactive", true);
            smokersLabel
                .classed("active", true)
                .classed("inactive", false);
            obesityLabel
                .classed("active", false)
                .classed("inactive", true); 
            }
            else {
            healthcareLabel
                .classed("active", false)
                .classed("inactive", true);
            smokersLabel
                .classed("active", false)
                .classed("inactive", true);
            obesityLabel
                .classed("active", true)
                .classed("inactive", false); 
            }
         }
    });
}).catch(function(error) {
    console.log(error);
  });
