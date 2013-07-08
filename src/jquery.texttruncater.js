/**
 *  Text Truncater jQuery Plugin
 *  Dan Silk, http://github.com/silkter
 *
 *  This plugin truncates text within a container that has a defined width and adds an ellipsis to the trunctation point.
 *
 *  NOTE: The truncation point is determined by using a maximum height of the container.  The max-height CSS property
 *        will be set to the maxHeight option value by the plugin to ensure the truncation point is determined properly.
 *
 *        The maximum height will be determined by the line height of the text within the container.  For example, to
 *        find the truncation point within a container so that only 3 lines of text will show when the line-height is
 *        18px, then the max-height of the container will be set to 3 x 18 or 54px.
 *
 **/
;(function ( $, window, document, undefined ) {
    
    // Create the defaults once
    var pluginName = 'textTruncator',
        defaults = {
            maxLines: 2,
            textSelector: ''
        };

    // The actual plugin constructor
    function Plugin( element, options ) {
        this.element = element;
        this.options = $.extend( {}, defaults, options) ;
        this._defaults = defaults;
        this._name = pluginName;
        
        var container = $(element).height('auto');
        this.container = {
            element: container,
            height: container.height(),
            width: container.width()
        };
        this.text = {
            selector: options.textSelector || ''
        };
       
        this.init();
    }

    /**
     * Determine the value of the maximum height of the text container and set it as the options.maxHeight
     **/
    Plugin.prototype._setMaxHeight = function () {
        if (this.text && this.text.element) {
            var lineHeight, words = this.text.element.find('span');
            if (words.length > 0) {
                lineHeight = words.eq(0).height();
                this.container.maxHeight = lineHeight * this.options.maxLines;
                this.container.element.css('max-height', this.container.maxHeight);
            }
        }
    };

    Plugin.prototype.init = function () {
        var plugin = this;
        // set the text properties of the plugin instance
        if (plugin.text.selector === '') {
            plugin.text.element = container;
            plugin.text.value = $.trim(plugin.container.element.text());
        } else {
            plugin.text.element = $(plugin.text.selector, plugin.container.element).eq(0);
            plugin.text.value = $.trim(plugin.text.element.text());
        }

        // process the text for truncation
        var words = this.text.value.split(' '),
            spanned = '<span style="display:inline-block">' + words.join('</span> <span style="display:inline-block">') + '</span>',
            ellipsis = $('<i class="dotdotdot">&#133;</i>'),
            lastWord, dotWidth, spaceWidth;
        
        plugin.text.element.html(spanned).append(ellipsis);
        plugin._setMaxHeight();
        
        // process the text and insert an ellipsis where it should be truncated
        if (plugin.container.maxHeight && plugin.text.element.height() > plugin.container.maxHeight) {
            plugin.text.element.find('span').each(function () {
                var word = $(this),
                    pos = word.position();
                
                if (word.width() > plugin.container.width) {
                    word.siblings('span').hide();
                    ellipsis.css({
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        background: '#ffffff',
                        borderLeft: '5px solid #ffffff'
                    });
                    return false;
                }
                if (!spaceWidth && lastWord && lastWord.position().top == pos.top) {
                    spaceWidth = Math.ceil(pos.left - lastWord.width());
                }
                if (lastWord && pos.top + word.height() > plugin.container.maxHeight) {
                    var leftPos = Math.ceil(lastWord.position().left) + lastWord.width() + (spaceWidth || 0);
                    if (plugin.container.width - leftPos > Math.ceil(ellipsis.width())) {
                        lastWord = word;
                    }
                    return false;
                } 
                lastWord = word;
            });
            lastWord.before(ellipsis);
        }
    };
    
    // add the plugin to jQuery
    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName, 
                new Plugin( this, options ));
            }
        });
    }

})( jQuery, window, document );