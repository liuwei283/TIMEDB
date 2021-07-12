import axios from "axios";
import { schemeGradient } from "crux/dist/color";
import * as d3 from "d3";

import * as _ from "lodash";
import { feature } from "topojson";
import { findBoundsForValues, findUpperBound} from "utils/maths";

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
        rangeMax: "#3262a8",
    };

const scaleBarPos = d3.scaleLinear().range([0, 80])
.domain([1, 3]);

const svg = d3.select("#world-map")
            .append("svg:svg")
            .attr("width", width)
            .attr("height", height + paddingB);
// Define the div for the tooltip
const div = d3.select("#world-map").append("div")
            .attr("class", "tooltip")
            .style("events", "none")
            .style("opacity", 0);

svg.append("g").attr("id", "container");
const projection = d3.geoNaturalEarth1();

const pathGenerator = d3.geoPath().projection(projection);
const g = d3.select("#container").append("g").attr("id","zoom-area");

const otherG = d3.select("#container").append("g").attr("id", "other")
    .attr("transform", `translate(50, ${ height - 50})`);
const legendG = d3.select("#container").append("g").attr("id", "legend")
    .attr("transform", `translate(0, ${ height})`);
const zoomBarG = d3.select("#container").append("g").attr("id", "zoomBar")
    .attr("transform", `translate(${width - 100}, ${ height - 50})`);
zoomBarG.append("polygon").attr("points", "0,0 10,0 5,10")
        .attr("id", "scaleAnchor").attr("transform", "translate(0,10)")
        .attr("fill", "#666");

const scaleTicks = [1, 1.5, 2, 2.5, 3];

zoomBarG.selectAll("line").data(scaleTicks)
    .enter()
    .append("line")
    .attr("stroke", "#000")
    .attr("y1", 20)
    .attr("y2", 15)
    .attr("x1", (d) => scaleBarPos(d)+5)
    .attr("x2", (d) => scaleBarPos(d)+5);
zoomBarG.selectAll("text").data(scaleTicks)
    .enter()
    .append("text")
    .attr("font-size", "11")
    .attr("y", 32)
    .attr("text-anchor", "middle")
    .text((d) => d)
    .attr("x", (d) => scaleBarPos(d)+5);
zoomBarG.append("text").text("Current Scale:")
        .attr("font-size", "11").attr("x", 0).attr("y", 0)
        .on("mouseover", () => {
            // //tip.show(d);
            div.transition()
                .duration(200)
                .style("opacity", 1);
            div.html(`<strong>Wheel to zoom in/out</strong>`)
                .style("left", (d3.event.pageX + 15) + "px")
                .style("top", (d3.event.pageY + 15) + "px")
                .style("padding", "5px")
                .style("border-radius", "3px")
                .style("color", "white")
                .style("background-color", "rgba(50,50,50, 0.85)");
          }).on("mouseout", () => {
            div.transition()
                .duration(500)
                .style("opacity", 0);
          });
zoomBarG.append("line").attr("strokeWidth", 1)
        .attr("stroke", "#000").attr("x1", 5).attr("y1", 20)
        .attr("x2", 85).attr("y2", 20);
// zoomBarG.append("text").text("1").attr("text-anchor", "middle")
//         .attr("x", 5).attr("y", 30).attr("font-size", 11);
// zoomBarG.append("text").text("3").attr("text-anchor", "middle")
//         .attr("x", 85).attr("y", 30).attr("font-size", 11);
legendG.append("rect")
    .attr("fill", "white")
    .attr("width", width)
    .attr("height", paddingB);
// gradient
const gradientDef = svg.append("defs")
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

const reset = () => {
    g.transition().duration(50).call(
        zoom.transform,
        d3.zoomIdentity,
      );
};
d3.select("#container").append("rect").attr("width", width).attr("height", height).attr("stroke", "grey").attr("strokeWidth", 2).attr("fill", "none");
g.append("path")
    .attr("class", "sphere")
    .attr("d", pathGenerator({type: "Sphere"}))
    .attr("fill", colors.background)
    .on("click", reset);
axios.all([axios.get("/data/static_viz_data/world_map/countries-110m.json"), axios.get("/data/static_viz_data/world_map/country.tsv")])
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
        .text(findUpperBound(Math.max(...numbers), 2))
        .attr("x", width - 248)
        .attr("y", paddingB / 2);
    const myScale = d3.scaleLinear()
                        .domain([0, max])
                        .range([0, 1]);
    // const div = d3.select("#world-map").append("div")
    //     .attr("class", "tooltip")
    //     .style("events", "none")
    //     .style("opacity", 0);
    g.selectAll("path").data(countries)
        .enter()
        .append("path")
        .attr("id", (d) => d.properties.name)
        .attr("class", "country")
        .attr("d", pathGenerator)
        .attr("fill", (d) => {
            const name = d.properties.name;
            // if (dict[name]) return grad.get(myScale(Math.sqrt(dict[name])));
            if (dict[name]) return grad.get(myScale(dict[name]));
            else return "lightgrey";
        })
        .attr("opacity", 0.9)
        .attr("stroke", colors.background)
        .attr("strokeWidth", "1")
        .on("mouseover", function (d) {
            // //tip.show(d);
            div.transition()
                .duration(200)
                .style("opacity", 1);
            div.html(`<strong>Country: </strong><span class="details">${d.properties.name }
                    <br></span><strong>Sample number: </strong><span class="details">${dict[d.properties.name]}</span>`)
                .style("left", (d3.event.pageX + 15) + "px")
                .style("top", (d3.event.pageY + 15) + "px")
                .style("padding", "5px")
                .style("border-radius", "3px")
                .style("color", "white")
                .style("background-color", "rgba(50,50,50, 0.85)");
            d3.select(this)
              .transition()
              .duration(100)
              .style("opacity", 1)
              .style("stroke", colors.activeStroke)
              .style("stroke-width", 2);
          })
          .on("mousemove", () => {
            div.style("left", (d3.event.pageX + 15) + "px")
                .style("top", (d3.event.pageY + 15) + "px");
          })
          .on("mouseout", function (d) {
            div.transition()
                .duration(500)
                .style("opacity", 0);
            d3.select(this)
              .transition()
              .duration(100)
              .style("opacity", 0.9)
              .style("stroke", colors.background)
              .style("stroke-width", 1);
          });
    otherG.append("text").text(`Unknown: ${dict["NULL"]}`)
          .attr("x", 0).attr("y", 20);
  }));

const zoom = d3.zoom()
    .extent([[0, 0], [width, height]])
    .scaleExtent([1, 3])
    .translateExtent([[0, 0], [width, height]])
    .on("zoom", () => {
        g.attr("transform", d3.event.transform);
        const offsetX = scaleBarPos(d3.event.transform.k);
        d3.select("#scaleAnchor")
          .transition()
          .duration(100)
          .attr("transform", `translate(${offsetX}, 10)`);
    });

svg.call(zoom);
