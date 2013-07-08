/**
 *  jQuery Text Truncater Plugin
 *  Author: Dan Silk, http://github.com/silkster
 *  
 *
 *  This plugin adds an ellipsis to a text string at the point in the text where it will be truncated
 *  to its containers height and width.
 *
 *  The container should have height and width and its overflow should be set to hidden.  Then the plugin
 *  will determine the best place to put the ellipsis.
 **/
;(function ( $, window, document, undefined ) {
    
    // Create the defaults once
    var pluginName = 'textTruncator',
        defaults = {
            maxHeight: 53,
            textSelector: ''
        };

    // The actual plugin constructor
    function Plugin( element, options ) {
        this.element = element;
        this.options = $.extend( {}, defaults, options) ;
        this._defaults = defaults;
        this._name = pluginName;
        
        var container = $(element).height('auto').css('max-height', options.maxHeight);
        this.container = {
            element: container,
            height: container.height(),
            width: container.width()
        };
        this.text = {
            selector: options.textSelector || ''
        };
        
        debugger;
        
        this.init();
    }

    Plugin.prototype.init = function () {
        var plugin = this;
        // set the text properties of the plugin instance
        if (plugin.text.selector === '') {
            plugin.text.value = plugin.container.element.text();
            plugin.text.element = container;
        } else {
            plugin.text.element = $(plugin.text.selector, plugin.container.element).eq(0);
            plugin.text.value = plugin.text.element.text();
        }
        
        // process the text for truncation
        var words = this.text.value.split(' '),
            spanned = '<span style="display:inline-block">' + words.join('</span> <span>') + '</span>',
            ellipsis = $('<i class="dotdotdot">&#133;</i>'),
            lastWord, dotWidth, spaceWidth;
        
        // process the text and insert an ellipsis where it should be truncated
        if (plugin.text.element.height() > plugin.container.height) {
            plugin.text.element.html(spanned).append(ellipsis);
            plugin.text.element.find('span').each(function () {
                var word = $(this),
                    pos = word.position();
                
                if (!spaceWidth && lastWord && lastWord.position().top == pos.top) {
                    spaceWidth = Math.ceil(pos.left - lastWord.width());
                }

                if (pos.top + word.height() > plugin.options.maxHeight) {
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
