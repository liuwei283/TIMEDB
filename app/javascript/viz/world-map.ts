import * as d3 from "d3";
//import { select, json, geoPath, geoNaturalEarth1, tsvParse, queue} from 'd3';
import { feature } from 'topojson';
import axios from "axios";
import * as _ from "lodash";
import { schemeGradient } from "crux/dist/color";
import { findBound, findBoundsForValues} from "utils/maths";


const width = 960,
    height = 500,
    paddingB = 100,
    colors = {
        background: "white",
        // activeStroke: "#F4FA58",
        activeStroke: "orange",
        rangeMin: "rgb(200,210,230)",
        // rangeMin: "#F8EFFB",
        // rangeMax: "#77095A",
        rangeMax: "#3262a8"
    };
var svg = d3.select("#world-map")
            .append("svg:svg")
            .attr("width",width)
            .attr("height",height + paddingB);
svg.append("g").attr("id", "container");
const projection = d3.geoNaturalEarth1();

const pathGenerator = d3.geoPath().projection(projection);
const g = d3.select("#container").append("g").attr('id',"zoom-area");

const otherG = d3.select("#container").append("g").attr("id", "other")
    .attr("transform", `translate(50, ${ height - 100})`)
const legendG = d3.select("#container").append("g").attr("id", "legend")
    .attr("transform", `translate(0, ${ height})`)
legendG.append("rect")
    .attr("fill", "white")
    .attr("width", width)
    .attr("height", paddingB);
// gradient
var gradientDef = svg.append("defs")
                .append("svg:linearGradient")
                .attr("id", "gradient")
                .attr("x1", "0%")
                .attr("y1", "100%")
                .attr("x2", "100%")
                .attr("y2", "100%")
                .attr("spreadMethod", "pad");
    gradientDef.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", colors.rangeMin)
        .attr("stop-opacity", 1);

    gradientDef.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", colors.rangeMax)
        .attr("stop-opacity", 1);

legendG.append("rect")
        .style("fill", "url(#gradient)")
        .attr("x",250)
        .attr("y", paddingB/4)
        .attr("width", width - 500)
        .attr("height", paddingB/5);
const grad = schemeGradient(colors.rangeMin, colors.rangeMax);

const reset =() => {
    g.transition().duration(50).call(
        zoom.transform,
        d3.zoomIdentity,
      );
}
d3.select("#container").append('rect').attr("width", width).attr("height", height).attr("stroke", "grey").attr("strokeWidth", 2).attr("fill", "none");
g.append('path')
    .attr('class', 'sphere')
    .attr('d', pathGenerator({type: 'Sphere'}))
    .attr("fill", colors.background)
    .on("click", reset);
axios.all([axios.get('/data/static_viz_data/world_map/countries-110m.json'), axios.get('/data/static_viz_data/world_map/country.tsv')])
  .then(axios.spread((topo, stat) => {
    const countries = feature(topo.data, topo.data.objects.countries).features;
    const data = d3.tsvParse(stat.data);
    const dict = {};
    const numbers = [];
    data.forEach(x => {
        dict[x.country] = parseInt(x.number);
        numbers.push(parseInt(x.number));
    });

    legendG.append("text")
        .text("0")
        .attr("x", 240)
        .attr("y", paddingB/2);
    
    // const [min, max] = findBoundsForValues(numbers.map(d=> Math.sqrt(d)), 2);
    const [min, max] = findBoundsForValues(numbers, 2);
    legendG.append("text")
        .text(findBound(_.max(numbers), 0, 2))
        .attr("x", width - 248)
        .attr("y", paddingB/2);
    const myScale = d3.scaleLinear()
                        .domain([0, max])
                        .range([0, 1]);

    // Define the div for the tooltip
    const div = d3.select("#world-map").append("div")	
        .attr("class", "tooltip")				
        .style("events", "none")
        .style("opacity", 0);
    g.selectAll('path').data(countries)
        .enter()
        .append('path')
        .attr('class', 'country')
        .attr('d', pathGenerator)
        .attr("fill", (d)=> {
            const name = d.properties.name;
            // if (dict[name]) return grad.get(myScale(Math.sqrt(dict[name])));
            if (dict[name]) return grad.get(myScale(dict[name]));
            else return "lightgrey";
        })
        .attr("opacity", 0.9)
        .attr("stroke", colors.background)
        .attr("strokeWidth", "1")
        .on('mouseover',function(d){
            // //tip.show(d);
            div.transition()		
                .duration(200)		
                .style("opacity", 1);
            div.html("<strong>Country: </strong><span class='details'>" + d.properties.name + "<br></span>" + "<strong>Sample number: </strong><span class='details'>" + dict[d.properties.name] +"</span>")	
                .style("left", (d3.event.pageX + 15) + "px")		
                .style("top", (d3.event.pageY + 15) + "px")
                .style("padding", "5px")
                .style("border-radius", "3px")
                .style("color", "white")
                .style("background-color", "rgba(50,50,50, 0.85)");			
            d3.select(this)
              .style("opacity", 1)
              .style("stroke",colors.activeStroke)
              .style("stroke-width",2);
          })
          .on('mousemove', () => {
            div.style("left", (d3.event.pageX + 15) + "px")		
                .style("top", (d3.event.pageY + 15) + "px");	
          })
          .on('mouseout', function(d){
            div.transition()		
                .duration(500)		
                .style("opacity", 0);	
            d3.select(this)
              .style("opacity", 0.9)
              .style("stroke",colors.background)
              .style("stroke-width",1);
          });
    // otherG.append("rect")
    //       .attr("width", 100)
    //       .attr("height", 70)
    //       .attr("fill", 'white')
    //       .attr("stroke", "black");
    otherG.append("text").text(`Unknown: ${dict["NULL"]}`)
          .attr("x", 0).attr("y", 20);
  }));

const zoom = d3.zoom()
    .extent([[0, 0], [width, height]])
    .scaleExtent([1, 3])
    .translateExtent([[0, 0], [width, height]])
    .on("zoom",function() {
        g.attr("transform", d3.event.transform);
    });


svg.call(zoom)

