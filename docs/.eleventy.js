const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const pluginTOC = require("eleventy-plugin-nesting-toc");

module.exports = function(eleventyConfig) {
    //  Add syntax highlighting
    eleventyConfig.addPlugin(syntaxHighlight);

    eleventyConfig.addLayoutAlias('page', 'layouts/page.html');
    eleventyConfig.addLayoutAlias('page-no-toc', 'layouts/page-no-toc.html');
    eleventyConfig.addLayoutAlias('page-icons', 'layouts/page-icons.html');

    // Copy assets over
    eleventyConfig.addPassthroughCopy('assets/css');
    eleventyConfig.addPassthroughCopy('assets/fonts');
    eleventyConfig.addPassthroughCopy('assets/images');
    eleventyConfig.addPassthroughCopy('assets/js');

    //  Icon shortcode
    //  Re-used (with love) from Stack Overflow's Stacks. Extended for our purposes
    eleventyConfig.addLiquidShortcode("iconSystem", function(name, classes, dimension) {
        var fs = require("fs");
        var path = "_includes/icons/system/" + name + ".svg";
        var svg = fs.readFileSync(path).toString("utf-8");
        var defaultClasses = "d-svg d-svg--system";

        // If we have classes, add them
        if (classes != null) {
            svg = svg.replace(defaultClasses, defaultClasses + " " + classes);
        }

        // If we need to change the size, do that too
        if (dimension != null) {
            svg = svg.replace('viewBox="0 0 24 24"', 'viewBox="0 0 24 24" width="' + dimension + 'px"');
        }

        return svg;
    });
    eleventyConfig.addLiquidShortcode("iconBrand", function(name, classes, dimension) {
        var fs = require("fs");
        var path = "_includes/icons/brand/" + name + ".svg";
        var svg = fs.readFileSync(path).toString("utf-8");
        var defaultClasses = "d-svg__" + name;

        // If we have classes, add them
        if (classes != null) {
            svg = svg.replace(defaultClasses, defaultClasses + " " + classes);
        }

        // If we need to change the size, do that too
        if (dimension != null) {
            svg = svg.replace('viewBox="0 0 24 24"', 'viewBox="0 0' + dimension + dimension + '"');
        }

        return svg;
    });
    eleventyConfig.addLiquidShortcode("pattern", function(name, classes, dimension) {
        var fs = require("fs");
        var path = "_includes/patterns/" + name + ".svg";
        var svg = fs.readFileSync(path).toString("utf-8");
        var defaultClasses = "d-svg__" + name;

        // If we have classes, add them
        if (classes != null) {
            svg = svg.replace(defaultClasses, defaultClasses + " " + classes);
        }

        // If we need to change the size, do that too
        if (dimension != null) {
            svg = svg.replace('viewBox="0 0 24 24"', 'viewBox="0 0' + dimension + dimension + '"');
        }

        return svg;
    });

    //  Generate header areas with anchor links
    eleventyConfig.addLiquidShortcode("header", function(tag, text, increment) {
        var slug = text.replace(/\s+/g, '-').toLowerCase();
        var id = slug;
        var output = '';

        //  If we have an increment
        if (increment != null) {
            id = slug + increment;
        }

        output += '<div class="d-d-flex d-jc-space-between d-ai-end d-pe-none">';
        if (tag == 'h2') {
            output +=   '<' + tag + ' class="d-fl1 d-headline24 js-scrollspy" id="'+ id + '">';
        }
        if (tag == 'h3') {
            output +=   '<' + tag + ' class="d-fl1 d-headline20 js-scrollspy" id="'+ id + '">';
        }
        output +=       '<span class="d-pe-auto">' + text + '</span>';
        output +=   '</' + tag + '>';
        output +=   '<a class="d-btn d-btn--muted d-pe-auto" href="#'+ id + '">';
        output +=       '<span class="d-btn__icon d-m0 d-ai-center"><svg aria-hidden="true" aria-label="Link" class="d-svg d-svg--system d-svg__link" viewBox="0 0 24 24"><path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1 0 1.71-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/></svg></span>';
        output +=   '</a>'
        output += '</div>';

        return output;
    });

    // Add shortcode for inline <code> tag
    eleventyConfig.addPairedShortcode("code", function(content) {
        return `<code class="d-py2 d-px4 d-bar2 d-bgc-purple-100 d-bgo50 d-fc-purple d-fs14">${content}</code>`;
    });

    // Add shortcode for code well wrapper
    eleventyConfig.addPairedShortcode("codeWell", function(content) {
        return `<aside class="d-bar8 d-of-hidden">${content}</aside>`;
    });

    // Add shortcode for code well header
    eleventyConfig.addPairedShortcode("codeWellHeader", function(content, color, minHeight) {
        if (!color) {
            return `<header class="d-fl-center d-fd-column d-p24 d-bgc-black-025 d-w100p ${minHeight}">${content}</header>`;
        } else if (color == "white") {
            return `<header class="d-fl-center d-fd-column d-p24 d-bgc-white d-w100p d-ba d-bc-black-050 d-btr8 d-baw2 ${minHeight}">${content}</header>`;
        } else {
            return `<header class="d-fl-center d-fd-column d-p24 d-bgc-${color} d-w100p ${minHeight}">${content}</header>`;
        }
    });

    // Add shortcode for code well footer
    eleventyConfig.addPairedShortcode("codeWellFooter", function(content) {
        return `<footer class="d-p8 d-bgc-black-600 d-bbr8 d-fs12">
    ${content}</footer>`;
    });

    // Add shortcode for basic paragraph
    eleventyConfig.addPairedShortcode("paragraph", function(content) {
        return `<p class="d-fs16 d-lh6">${content}</p>`;
    });

    // Add shortcode for unordered list
    eleventyConfig.addPairedShortcode("ul", function(content) {
        return `<ul class="d-fs16 d-lh6 d-stack16">${content}</ul>`;
    });

    // Add shortcode for ordered list
    eleventyConfig.addPairedShortcode("ol", function(content) {
        return `<ol class="d-fs16 d-lh6 d-stack16">${content}</ol>`;
    });

    //  Add submenu navigation
    eleventyConfig.addPlugin(pluginTOC, {tags: ['h2', 'h3']});


    return {
        dir: {
            css: "assets/css"
        }
    }
}
