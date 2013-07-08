# jQuery Text Truncater Plugin

This plugin adds an ellipsis to a text string at the point in the text where it will be truncated to its containers width and the maximum number of lines to show.

## Notes

Each word in the element text will be wrapped with a span tag with CSS property display: inline-block.  The truncation point will be set by inserting an ellipsis character between the last word of the last line to show and the first word of the next line.  The truncation point is determined by using the maximum height for the container.  The max-height CSS property is determined by multiplying the height of the first word of the text by the value of the maximum number of lines to show (options.maxLines).

The container should have a set width and set overflow: hidden in order for the plugin to determine the best place to put the ellipsis.

### Example usage:

A list of items with the class "listItem" that each contain a link that must be limited to 3 lines of text:

$(function () {
    $('.listItem').textTruncator({
        maxLines: 3
        textSelector: 'a'
    });
});
