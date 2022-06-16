document.addEventListener("DOMContentLoaded", () => {

    var entries = [ 
        
        { label: 'ACC', url: 'https://timedb.deepomics.org/cancers/1', target: '_top', class: "cancer-link"},
        { label: 'BLCA', url: 'https://timedb.deepomics.org/cancers/2', target: '_top', class: "cancer-link"},
        { label: 'BRCA', url: 'https://timedb.deepomics.org/cancers/3', target: '_top', class: "cancer-link" },
        { label: 'CESC', url: 'https://timedb.deepomics.org/cancers/4', target: '_top', class: "cancer-link" },
        { label: 'CHOL', url: 'https://timedb.deepomics.org/cancers/5', target: '_top', class: "cancer-link" },
        { label: 'COAD', url: 'https://timedb.deepomics.org/cancers/6', target: '_top', class: "cancer-link" },
        { label: 'DLBC', url: 'https://timedb.deepomics.org/cancers/7', target: '_top', class: "cancer-link" },
        { label: 'ESCA', url: 'https://timedb.deepomics.org/cancers/8', target: '_top', class: "cancer-link" },
        { label: 'NBL', url: 'https://timedb.deepomics.org/cancers/9', target: '_top', class: "cancer-link" },
        { label: 'GBM', url: 'https://timedb.deepomics.org/cancers/10', target: '_top', class: "cancer-link" },
        { label: 'HNSC', url: 'https://timedb.deepomics.org/cancers/11', target: '_top', class: "cancer-link" },
        { label: 'KICH', url: 'https://timedb.deepomics.org/cancers/12', target: '_top', class: "cancer-link" },
        { label: 'KIRC', url: 'https://timedb.deepomics.org/cancers/13', target: '_top', class: "cancer-link" },
        { label: 'WT', url: 'https://timedb.deepomics.org/cancers/14', target: '_top', class: "cancer-link" },
        { label: 'CCSK', url: 'https://timedb.deepomics.org/cancers/15', target: '_top', class: "cancer-link" },
        { label: 'RT', url: 'https://timedb.deepomics.org/cancers/16', target: '_top', class: "cancer-link" },
        { label: 'KIRP', url: 'https://timedb.deepomics.org/cancers/17', target: '_top', class: "cancer-link" },
        { label: 'AML', url: 'https://timedb.deepomics.org/cancers/18', target: '_top', class: "cancer-link" },
        { label: 'CML', url: 'https://timedb.deepomics.org/cancers/19', target: '_top', class: "cancer-link" },
        { label: 'ALL', url: 'https://timedb.deepomics.org/cancers/20', target: '_top', class: "cancer-link" },
        { label: 'CLL', url: 'https://timedb.deepomics.org/cancers/21', target: '_top', class: "cancer-link" },
        { label: 'LGG', url: 'https://timedb.deepomics.org/cancers/22', target: '_top', class: "cancer-link" },
        { label: 'LIHC', url: 'https://timedb.deepomics.org/cancers/23', target: '_top', class: "cancer-link" },
        { label: 'LUAD', url: 'https://timedb.deepomics.org/cancers/24', target: '_top', class: "cancer-link" },
        { label: 'LUSC', url: 'https://timedb.deepomics.org/cancers/25', target: '_top', class: "cancer-link" },
        { label: 'MESO', url: 'https://timedb.deepomics.org/cancers/26', target: '_top', class: "cancer-link" },
        { label: 'OS', url: 'https://timedb.deepomics.org/cancers/27', target: '_top', class: "cancer-link" },
        { label: 'OV', url: 'https://timedb.deepomics.org/cancers/28', target: '_top', class: "cancer-link" },
        { label: 'PAAD', url: 'https://timedb.deepomics.org/cancers/29', target: '_top', class: "cancer-link" },
        { label: 'PCPG', url: 'https://timedb.deepomics.org/cancers/30', target: '_top', class: "cancer-link" },
        { label: 'PRAD', url: 'https://timedb.deepomics.org/cancers/31', target: '_top', class: "cancer-link" },
        { label: 'READ', url: 'https://timedb.deepomics.org/cancers/32', target: '_top', class: "cancer-link" },
        { label: 'SARC', url: 'https://timedb.deepomics.org/cancers/33', target: '_top', class: "cancer-link" },
        { label: 'SKCM', url: 'https://timedb.deepomics.org/cancers/34', target: '_top', class: "cancer-link" },
        { label: 'STAD', url: 'https://timedb.deepomics.org/cancers/35', target: '_top', class: "cancer-link" },
        { label: 'TGCT', url: 'https://timedb.deepomics.org/cancers/36', target: '_top', class: "cancer-link" },
        { label: 'THCA', url: 'https://timedb.deepomics.org/cancers/37', target: '_top', class: "cancer-link" },
        { label: 'THYM', url: 'https://timedb.deepomics.org/cancers/38', target: '_top', class: "cancer-link" },
        { label: 'UCEC', url: 'https://timedb.deepomics.org/cancers/39', target: '_top', class: "cancer-link" },
        { label: 'UCS', url: 'https://timedb.deepomics.org/cancers/40', target: '_top', class: "cancer-link" },
        { label: 'UVM', url: 'https://timedb.deepomics.org/cancers/41', target: '_top', class: "cancer-link" },
        { label: 'OTHERS', url: 'https://timedb.deepomics.org/cancers/42', target: '_top', class: "cancer-link" },
        { label: 'SCLC', url: 'https://timedb.deepomics.org/cancers/43', target: '_top', class: "cancer-link" },
        { label: 'TCGA', url: 'https://www.cancer.gov/about-nci/organization/ccg/research/structural-genomics/tcga', target: '_top', class: "ds-link" },
        { label: 'GEO', url: 'https://www.ncbi.nlm.nih.gov/geo/', target: '_top', class: "ds-link" },
        { label: 'TARGET', url: 'https://ocg.cancer.gov/programs/target/data-matrix', target: '_top', class: "ds-link" },
        { label: 'ABIS', url: 'https://timedb.deepomics.org/download', target: '_top', class: "download-link" },
        { label: 'CIBERSORT', url: 'https://timedb.deepomics.org/download', target: '_top', class: "download-link" },
        { label: 'CIBERSORTX', url: 'https://timedb.deepomics.org/download', target: '_top', class: "download-link" },
        { label: 'ImmuCellAI', url: 'https://timedb.deepomics.org/download', target: '_top', class: "download-link" },
        { label: 'xCell', url: 'https://timedb.deepomics.org/download', target: '_top', class: "download-link" },
        { label: 'ConsensusTME', url: 'https://timedb.deepomics.org/download', target: '_top', class: "download-link" },
        { label: 'MCPcounter', url: 'https://timedb.deepomics.org/download', target: '_top', class: "download-link" },
        { label: 'EPIC', url: 'https://timedb.deepomics.org/download', target: '_top', class: "download-link" },
        { label: 'TIMER', url: 'https://timedb.deepomics.org/download', target: '_top', class: "download-link" },
        { label: 'quanTIseq', url: 'https://timedb.deepomics.org/download', target: '_top', class: "download-link" },
    ];

    var settings = {

        entries: entries,
        width: 500,
        height: 500,
        radius: '65%',
        radiusMin: 75,
        bgDraw: true,
        bgColor: '#f8f9fa',
        opacityOver: 1.00,
        opacityOut: 0.05,
        opacitySpeed: 6,
        fov: 800,
        speed: 0.5,
        fontFamily: 'Oswald, Arial, sans-serif',
        fontSize: '20',
        fontColor: '#253959',
        fontWeight: 'normal',//bold
        fontStyle: 'normal',//italic 
        fontStretch: 'normal',//wider, narrower, ultra-condensed, extra-condensed, condensed, semi-condensed, semi-expanded, expanded, extra-expanded, ultra-expanded
        fontToUpperCase: true,
        tooltipFontFamily: 'Oswald, Arial, sans-serif',
        tooltipFontSize: '11',
        tooltipFontColor: '#fff',
        tooltipFontWeight: 'normal',//bold
        tooltipFontStyle: 'normal',//italic 
        tooltipFontStretch: 'normal',//wider, narrower, ultra-condensed, extra-condensed, condensed, semi-condensed, semi-expanded, expanded, extra-expanded, ultra-expanded
        tooltipFontToUpperCase: false,
        tooltipTextAnchor: 'left',
        tooltipDiffX: 0,
        tooltipDiffY: 10

    };

    //var svg3DTagCloud = new SVG3DTagCloud( document.getElementById( 'holder'  ), settings );
    $( '#word-cloud' ).svg3DTagCloud( settings );


    

} );

/*
Copyright (c) 2017 Niklas Knaack

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

!function(){function t(t,e){function o(){F=document.createElementNS(N,"svg"),F.addEventListener("mousemove",v),t.appendChild(F),x.bgDraw&&(D=document.createElementNS(N,"rect"),D.setAttribute("x",0),D.setAttribute("y",0),D.setAttribute("fill",x.bgColor),F.appendChild(D)),a(),i(),h(),window.addEventListener("resize",b)}function i(){var e=window.innerWidth||document.documentElement.clientWidth||document.body.clientWidth,o=window.innerHeight||document.documentElement.clientHeight||document.body.clientHeight,i=e,r=o;x.width.toString().indexOf("%")>0||x.height.toString().indexOf("%")>0?(i=Math.round(t.offsetWidth/100*parseInt(x.width)),r=Math.round(i/100*parseInt(x.height))):(i=parseInt(x.width),r=parseInt(x.height)),i>=e&&(i=e),r>=o&&(r=o),P={x:i/2,y:r/2},E.x=x.speed/P.x,E.y=x.speed/P.y,S=i>=r?r/100*parseInt(x.radius):i/100*parseInt(x.radius),1>S&&(S=1),C=S/2,C<x.radiusMin&&(C=x.radiusMin,S=2*C),F.setAttribute("width",i),F.setAttribute("height",r),x.bgDraw&&(D.setAttribute("width",i),D.setAttribute("height",r)),n(C)}function n(t){for(var e=0,o=z.length;o>e;e++)r(z[e],t)}function r(t,e){var o=t.vectorPosition.x-O.x,i=t.vectorPosition.y-O.y,n=t.vectorPosition.z-O.z,r=Math.sqrt(o*o+i*i+n*n);t.vectorPosition.x/=r,t.vectorPosition.y/=r,t.vectorPosition.z/=r,t.vectorPosition.x*=e,t.vectorPosition.y*=e,t.vectorPosition.z*=e}function s(t,e,o,i,n){var r={};return"undefined"!=typeof e.label?(r.element=document.createElementNS(N,"text"),r.element.setAttribute("x",0),r.element.setAttribute("y",0),r.element.setAttribute("fill",e.fontColor),r.element.setAttribute("font-family",x.fontFamily),r.element.setAttribute("font-size",x.fontSize),r.element.setAttribute("font-weight",x.fontWeight),r.element.setAttribute("font-style",x.fontStyle),r.element.setAttribute("font-stretch",x.fontStretch),r.element.setAttribute("text-anchor","middle"),r.element.textContent=x.fontToUpperCase?e.label.toUpperCase():e.label):"undefined"!=typeof e.image&&(r.element=document.createElementNS(N,"image"),r.element.setAttribute("x",0),r.element.setAttribute("y",0),r.element.setAttribute("width",e.width),r.element.setAttribute("height",e.height),r.element.setAttribute("id","image_"+t),r.element.setAttributeNS("http://www.w3.org/1999/xlink","href",e.image),r.diffX=e.width/2,r.diffY=e.height/2),r.link=document.createElementNS(N,"a"),r.link.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href",e.url),r.link.setAttribute("target",e.target),r.link.setAttribute("class",e.class),r.link.addEventListener("mouseover",m,!0),r.link.addEventListener("mouseout",y,!0),r.link.appendChild(r.element),"undefined"!=typeof e.tooltip?(r.tooltip=!0,r.tooltipLabel=x.tooltipFontToUpperCase?e.tooltip.toUpperCase():e.tooltip):r.tooltip=!1,r.index=t,r.mouseOver=!1,r.vectorPosition={x:o,y:i,z:n},r.vector2D={x:0,y:0},F.appendChild(r.link),r}function a(){for(var t=!1,e=1,o=x.entries.length+1;o>e;e++){var i=Math.acos(-1+2*e/o),n=Math.sqrt(o*Math.PI)*i,r=Math.cos(n)*Math.sin(i),a=Math.sin(n)*Math.sin(i),u=Math.cos(i),c=s(e-1,x.entries[e-1],r,a,u);z.push(c),"undefined"!=typeof x.entries[e-1].tooltip&&(t=!0)}t&&l()}function l(){w=document.createElementNS(N,"text"),w.setAttribute("x",0),w.setAttribute("y",0),w.setAttribute("fill",x.tooltipFontColor),w.setAttribute("font-family",x.tooltipFontFamily),w.setAttribute("font-size",x.tooltipFontSize),w.setAttribute("font-weight",x.tooltipFontWeight),w.setAttribute("font-style",x.tooltipFontStyle),w.setAttribute("font-stretch",x.tooltipFontStretch),w.setAttribute("text-anchor",x.tooltipTextAnchor),w.textContent="",F.appendChild(w)}function u(t){for(var e=0,o=z.length;o>e;e++){var i=z[e];if(i.element.getAttribute("x")===t.getAttribute("x")&&i.element.getAttribute("y")===t.getAttribute("y"))return i}}function c(t){for(var e=0,o=z.length;o>e;e++){var i=z[e];i.index===t.index?i.mouseOver=!0:i.mouseOver=!1}}function f(t){t.tooltip&&(w.setAttribute("x",t.vector2D.x-x.tooltipDiffX),w.setAttribute("y",t.vector2D.y-x.tooltipDiffY),w.textContent=x.tooltipFontToUpperCase?t.tooltipLabel.toUpperCase():t.tooltipLabel,w.setAttribute("opacity",1))}function d(t){w.setAttribute("opacity",0)}function p(){var t=E.x*T.x-x.speed,e=x.speed-E.y*T.y,o=t*I,i=e*I;k.sx=Math.sin(o),k.cx=Math.cos(o),k.sy=Math.sin(i),k.cy=Math.cos(i);for(var n=0,r=z.length;r>n;n++){var s=z[n];if(M){var a=s.vectorPosition.x,l=s.vectorPosition.y*k.sy+s.vectorPosition.z*k.cy;s.vectorPosition.x=a*k.cx+l*k.sx,s.vectorPosition.y=s.vectorPosition.y*k.cy+s.vectorPosition.z*-k.sy,s.vectorPosition.z=a*-k.sx+l*k.cx}var u=x.fov/(x.fov+s.vectorPosition.z);s.vector2D.x=s.vectorPosition.x*u+P.x,s.vector2D.y=s.vectorPosition.y*u+P.y,s.diffX&&s.diffY&&(s.vector2D.x-=s.diffX,s.vector2D.y-=s.diffY),s.element.setAttribute("x",s.vector2D.x),s.element.setAttribute("y",s.vector2D.y);var c;M?(c=(C-s.vectorPosition.z)/S,c<x.opacityOut&&(c=x.opacityOut)):(c=parseFloat(s.element.getAttribute("opacity")),c+=s.mouseOver?(x.opacityOver-c)/x.opacitySpeed:(x.opacityOut-c)/x.opacitySpeed),s.element.setAttribute("opacity",c)}z=z.sort(function(t,e){return e.vectorPosition.z-t.vectorPosition.z})}function h(){requestAnimFrame(h),p()}function m(t){M=!1;var e=u(t.target);c(e),e.tooltip&&f(e)}function y(t){M=!0;var e=u(t.target);e.tooltip&&d(e)}function v(t){T=g(F,t)}function g(t,e){var o=t.getBoundingClientRect();return{x:e.clientX-o.left,y:e.clientY-o.top}}function b(t){i()}var x={entries:[],width:480,height:480,radius:"70%",radiusMin:75,bgDraw:!0,bgColor:"#000",opacityOver:1,opacityOut:.05,opacitySpeed:6,fov:800,speed:2,fontFamily:"Arial, sans-serif",fontSize:"15",fontColor:"#fff",fontWeight:"normal",fontStyle:"normal",fontStretch:"normal",fontToUpperCase:!1,tooltipFontFamily:"Arial, sans-serif",tooltipFontSize:"15",tooltipFontColor:"#fff",tooltipFontWeight:"normal",tooltipFontStyle:"normal",tooltipFontStretch:"normal",tooltipFontToUpperCase:!1,tooltipTextAnchor:"left",tooltipDiffX:0,tooltipDiffY:10};if(void 0!==e)for(var A in e)e.hasOwnProperty(A)&&x.hasOwnProperty(A)&&(x[A]=e[A]);if(!x.entries.length)return!1;var w,C,S,P,F,D,z=[],M=!0,T={x:0,y:0},O={x:0,y:0,z:0},E={x:0,y:0},k={sx:0,cx:0,sy:0,cy:0},I=Math.PI/180,N="http://www.w3.org/2000/svg";window.requestAnimFrame=function(){return window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||function(t){window.setTimeout(t,1e3/60)}}(),o()}window.SVG3DTagCloud=t}(),"undefined"!=typeof jQuery&&!function(t){t.fn.svg3DTagCloud=function(e){var o=arguments;return this.each(function(){if(t.data(this,"plugin_SVG3DTagCloud")){var i=t.data(this,"plugin_SVG3DTagCloud");i[e]?i[e].apply(this,Array.prototype.slice.call(o,1)):t.error("Method "+e+" does not exist on jQuery.svg3DTagCloud")}else t.data(this,"plugin_SVG3DTagCloud",new SVG3DTagCloud(this,e))})}}(jQuery);