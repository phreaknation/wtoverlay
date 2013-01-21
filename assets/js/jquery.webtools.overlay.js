/*
 * Webtools Overlay Plugin
 * http://
 *
 * Copyright 2012, Joel Dies
 * Author: Joel Dies
 * Version 0.0.1
 */

 /**
  * @fileOverview Overlay Plugin for Webtools
  * @author Joel T. Dies
  * @version: 0.0.3
  */
(function (jQuery) {
    var base = this; // To avoid scope issues, use 'base' instead of 'this' to reference this class from internal events and functions.
    var mouseoffset;
    var mousemove = false;
    var currentoverlay = 0;
    var numofoverlays = 0;
    var methods = {
        /**
         * Base initialization method
         *
         * @memberOf jQuery.overlay
         */
        init : function (el, options, modes) {

            var defaults = {};
            options = jQuery.extend(defaults, options);
            var keys = Array();
            jQueryel = jQuery(el); // Access to jQuery version of element
            el = el; // Access to DOM version of element

            jQueryel.data("overlay", base); // Add a reverse reference to the DOM object

            $(document).keydown(function(e){
                switch (e.which) {
                    case 16:
                        keys[e.which] = true
                        break;
                    case 17:
                        keys[e.which] = true
                        break;
                    case 37:
                        if (keys[17]) { // Ctrl
                            $('#overlay-left').spinner('value', parseInt($('#overlay-left').val()) - 1)
                            $('#overlay-right').spinner('value', parseInt($('#overlay-right').val()) + 1)
                        }
                        else if (keys[16]) { // Shift
                            $('#overlay-left').spinner('value', parseInt($('#overlay-left').val()) - 10)
                            $('#overlay-right').spinner('value', parseInt($('#overlay-right').val()) + 10)
                        }
                        setPos()
                        break;
                    case 38:
                        if (keys[17]) {
                            $('#overlay-top').spinner('value', parseInt($('#overlay-top').val()) - 1)
                            $('#overlay-bottom').spinner('value', parseInt($('#overlay-bottom').val()) + 1)
                        }
                        else if (keys[16]) { // Shift
                            $('#overlay-top').spinner('value', parseInt($('#overlay-top').val()) - 10)
                            $('#overlay-bottom').spinner('value', parseInt($('#overlay-bottom').val()) + 10)
                        }
                        setPos()
                        break;
                    case 39:
                        if (keys[17]) {
                            $('#overlay-left').spinner('value', parseInt($('#overlay-left').val()) + 1)
                            $('#overlay-right').spinner('value', parseInt($('#overlay-right').val()) - 1)
                        }
                        else if (keys[16]) { // Shift
                            $('#overlay-left').spinner('value', parseInt($('#overlay-left').val()) + 10)
                            $('#overlay-right').spinner('value', parseInt($('#overlay-right').val()) - 10)
                        }
                        setPos()
                        break;
                    case 40:
                        if (keys[17]) {
                            $('#overlay-top').spinner('value', parseInt($('#overlay-top').val()) + 1)
                            $('#overlay-bottom').spinner('value', parseInt($('#overlay-bottom').val()) - 1)
                        }
                        else if (keys[16]) { // Shift
                            $('#overlay-top').spinner('value', parseInt($('#overlay-top').val()) + 10)
                            $('#overlay-bottom').spinner('value', parseInt($('#overlay-bottom').val()) - 10)
                        }
                        setPos()
                        break;
                    default:
                        console.log(e.which);
                        break;
                }
            }).keyup(function(e){
                switch (e.which) {
                    case 16:
                        keys[e.which] = false
                        break;
                    case 17:
                        keys[e.which] = false
                        break;
                    default:
                        //console.log(e.which);
                        break;
                }
            })
            
            mouseoffset = (0,0)
            jQuery("span.overlay").each(function() {
                jQuery(this).click(function() {
                    if (!jQuery('.overlay ').hasClass('disabled')) {
                        if (jQuery(this).hasClass("toggled")) {
                            jQuery("span.overlay").removeClass("toggled");
                            jQuery("div#overlay-menu").animate({"height": "10px"}, "fast")
                        }
                        else {
                            jQuery("span.overlay").addClass("toggled");
                            jQuery("div#overlay-menu").animate({"height": "236px"}, "fast")
                        }
                    }
                });
            }).addClass("left");

            if (jQuery('body').css("position") != 'relative')
                jQuery('body').css({ "position": "relative" });
            jQuery("body").append('<div id="overlay-menu"></div>')
            jQuery("#overlay-menu").hide()
            methods.buildMenu();
            var timer;
            timer = setInterval(function(){
                if (parseInt(jQuery("#webtools_topcontainer").css('bottom')) == 0) {
                    jQuery("#overlay-menu").show()
                    clearInterval(timer)
                }
            },10);
        },
    
        buildMenu: function() {
            var options_alignment  = '<span style="margin-right: 10px; vertical-align: bottom;">Alignment</span><span><select id="overlay-alignment" title="Align" style="vertical-align: bottom;">'+
            '<option id="overlay-alignment-null" value="null" selected="selected">None</option>'+
            '<option id="overlay-alignment-tl" value="top left">Top Left</option>'+
            '<option id="overlay-alignment-tc" value="top center">Top Center</option>'+
            '<option id="overlay-alignment-tr" value="top right">Top Right</option>'+
            '<option id="overlay-alignment-ml" value="middle left">Middle Left</option>'+
            '<option id="overlay-alignment-mc" value="middle center">Middle Center</option>'+
            '<option id="overlay-alignment-mr" value="middle right">Middle Right</option>'+
            '<option id="overlay-alignment-bl" value="bottom left">Bottom Left</option>'+
            '<option id="overlay-alignment-bc" value="bottom center">Bottom Center</option>'+
            '<option id="overlay-alignment-br" value="bottom right">Bottom Right</option>'+
            '</select></span>';
            var options_dimentions = '<span style="margin-right: 10px; vertical-align: bottom;">Dimensions</span><span>'+
                '<span style="vertical-align: bottom;">Height:</span><input id="overlay-height" name="overlay-height" value="0" size="2" />'+
                '<span style="vertical-align: bottom; margin-left: 10px;">Width:</span><input id="overlay-width" name="overlay-width" value="0" size="2" /></span>';
            var options_lock       = '<span style="margin-right: 10px; vertical-align: bottom;">Lock</span><span>'+
                '<input type="checkbox" id="overlay-lock" name="overlay-lock" style="vertical-align: bottom;" title="Lock the position and dimentions of the overlay you are currently selected." /><label for="overlay-lock" style-"vertical-align: bottom;">Lock Layer</label></span>';
            var options_opacity    = '<span style="margin-right: 10px; vertical-align: bottom;">Opacity</span><span><div id="overlay-opacity" title="Change the Opacity of the currently selected overlay"></div><span id="overlay-opacity-amount" style="vertical-align: middle;">1</span></span>';
            var options_position   = '<span style="margin-right: 10px; vertical-align: bottom;">Position</span><span>'+
                '<span style="vertical-align: bottom;">Left:</span><input id="overlay-left" name="overlay-left" value="0" size="2" />'+
                '<span style="vertical-align: bottom; margin-left: 10px;">Top:</span><input id="overlay-top" name="overlay-top" value="0" size="2" /></span>';
            var options_zindex     = '<span style="margin-right: 10px; vertical-align: bottom;">z-Index</span><span><input id="overlay-zIndex" name="overlay-zIndex" value="5001" size="5" /></span>';
            jQuery("div#overlay-menu").addClass("gradient blue")
                .append('<div id="overlay-list"><span>Overlay List</span><span class="right ui-state-default ui-corner-all"><span id="overlay-add" title="Add an Overlay"></span></span><ul></ul></div>')
                .append('<div id="overlay-options"><div>Options</div><ul>'+
                    '<li>'+options_alignment+'</li>'+
                    '<li>'+options_dimentions+'</li>'+
                    '<li>'+options_lock+'</li>'+
                    '<li>'+options_opacity+'</li>'+
                    '<li>'+options_position+'</li>'+
                    '<li>'+options_zindex+'</li></ul></div>');
            $('#overlay-alignment').attr({"disable":"disable"})
            $('#overlay-left, #overlay-top').spinner({
                spin: setPos,
                stop: setPos
            })
            
            $('#overlay-alignment').change(function() {
                if ($(this).val() != 'null') {
                    if ($(overlay).css("position") != 'absolute')
                        $(overlay).css({"position": 'absolute'})
                var overlay = '#overlay'+$('#overlay-list ul li.selected').attr('layer');
                    var alignment = $(this).val().split(" ");
                    if (alignment[0] == 'top')
                        $(overlay).css({"top": '0px'})
                    else if (alignment[0] == 'middle')
                        $(overlay).css({"top": (parseInt($('body').css('height')) / 2) - (parseInt($(overlay).css('height')) / 2) + 'px'})
                    else if (alignment[0] == 'bottom')
                        $(overlay).css({"top": parseInt($('body').css('height')) - parseInt($(overlay).css('height')) + 'px'})
                    
                    if (alignment[1] == 'left')
                        $(overlay).css({"left": '0px'})
                    else if (alignment[1] == 'center')
                        $(overlay).css({"left": (parseInt($('body').css('width')) / 2) - (parseInt($(overlay).css('width')) / 2) + 'px'})
                    else if (alignment[1] == 'right')
                        $(overlay).css({"left": parseInt($('body').css('width')) - parseInt($(overlay).css('width')) + 'px'})
                }
                getPos(ui)
            })
            
            $('#overlay-height, #overlay-width').spinner({
                spin: setSize,
                stop: setSize
            })
            
            $('#overlay-zIndex').spinner({
                change: function() {
                    var overlay = '#overlay'+$('#overlay-list ul li.selected').attr('layer')
                    var zindex = $('#overlay-zIndex').val()
                    
                    $('#overlay'+$(overlay).attr('layer')).css({"z-index": parseInt(zindex)})
                },
                stop: function() {
                    var overlay = '#overlay'+$('#overlay-list ul li.selected').attr('layer')
                    var zindex = $('#overlay-zIndex').val()
                    
                    $('#overlay'+$(overlay).attr('layer')).css({"z-index": parseInt(zindex)})
                }
            }).keyup(function() {
                var overlay = '#overlay'+$('#overlay-list ul li.selected').attr('layer')
                var zindex = $(this).spinner("value")
                
                $('#overlay'+$(overlay).attr('layer')).css({"z-index": parseInt(zindex)})
            })
            
            $('#overlay-opacity').slider({
                min: 0,
                max: 100,
                value: 100,
                slide: function(event, ui) {
                    $("#overlay-opacity-amount").text(ui.value/100);
                    $('#overlay'+$('#overlay-list ul li.selected').attr('layer')).css({"opacity": ui.value/100})
                }
            })
            
            $('#overlay-left, #overlay-top, #overlay-width, #overlay-height').parent().css({"margin-left":"4px"})
            
            var uploader = new qq.FileUploader({
                element: jQuery("#overlay-add")[0],
                action: 'upload.php',
                uploadButtonText: '+',
                multiple: 'false',
                acceptFiles: 'image/*',
                debug: true,
                disableDefaultDropzone: true,
                uploadButtonText: '<i class="ui-icon ui-icon-plus"></i>',
                template: '<div class="qq-uploader">' +
                        '<div class="qq-upload-button" style="width: auto;">{uploadButtonText}</div>' +
                        '<ul class="qq-upload-list" style="margin-top: 10px; text-align: center;"></ul>' +
                    '</div>',
                classes: {
                    button: 'qq-upload-button',
                    drop: 'qq-upload-drop-area',
                    dropActive: 'qq-upload-drop-area-active',
                    dropDisabled: 'qq-upload-drop-area-disabled',
                    list: 'qq-upload-list',
                    progressBar: 'qq-progress-bar',
                    file: 'qq-upload-file',
                    spinner: 'qq-upload-spinner',
                    finished: 'qq-upload-finished',
                    size: 'qq-upload-size',
                    cancel: 'qq-upload-cancel',
                    failText: 'qq-upload-failed-text',
                    success: 'alert alert-success',
                    fail: 'alert alert-error',
                    successIcon: null,
                    failIcon: null
                },
                onComplete: function(id, fileName, responseJSON) {
                    if (responseJSON.success) {
                        numofoverlays++
                        
                        $('#overlay-list ul li.selected').removeClass("selected")
                        var li = $('<li></li>').attr({"title": fileName}).append('<span class="overlay-picture"></span><span class="overlay-name"></span><span class="overlay-close" class="right ui-state-default ui-corner-all"><span class="ui-icon ui-icon-close" title="Remove Layer">x</span></span>');
                        jQuery("#overlay-list ul").append(li)
                        $('.overlay-picture:last').attr({"title": fileName}).append('<img height="32px" width="32px" src="overlays/'+ fileName +'" alt="' + fileName + '" />');
                        $('.overlay-name:last').attr({"title": fileName}).text(fileName).parent().attr({"layer":numofoverlays}).addClass("selected");
                        jQuery('body').append('<div id="overlay'+numofoverlays+'" class="overlay-overlay" layer="'+numofoverlays+'" style="z-index: '+(5000 + numofoverlays)+'"><img src="overlays/'+ fileName +'" alt="'+fileName+'" /></div>')
                        $('#overlay'+numofoverlays).css({
                            'height': $('#overlay'+numofoverlays+' img').css('height'),
                            'width': $('#overlay'+numofoverlays+' img').css('width')
                        })
                        $('#overlay-width').spinner('value',parseInt($('#overlay'+$('#overlay-list ul li.selected').attr('layer')+ ' img').css('width')))
                        $('#overlay-height').spinner('value',parseInt($('#overlay'+$('#overlay-list ul li.selected').attr('layer')+ ' img').css('height')))
                        
                        $('#overlay'+$('#overlay-list ul li.selected').attr('layer')).mousedown(function(e) {
                            $('#overlay-list ul li[layer='+ $(this).attr('layer') +']').click()
                        }).draggable({
                            drag: function(e, ui) {
                                getPos(ui)
                            },
                            stop: function(e, ui) {
                                getPos(ui)
                            }
                        }).resizable({
                            resize: function(e, ui) {
                                getSize(ui)
                                $(this).css({
                                    height: ui.size.height,
                                    width: ui.size.width
                                })
                                $('#overlay'+$('#overlay-list ul li.selected').attr('layer')+' img').attr({
                                    height: ui.size.height,
                                    width: ui.size.width
                                })
                            },
                            stop: function(e, ui) {
                                getSize(ui)
                            }
                        }).children("img").load(function() {
                            $(this).parent().css({
                                "height": $(this).css("height"),
                                "width": $(this).css("width")
                            })
                        })
                        
                        $('.overlay-overlay').bind('dragstart', function(event) { if ($(this).attr('locked') == 'true') event.preventDefault(); });
                        
                        $('#overlay-list ul li, #overlay-list ul li *').click(function() {
                            $('#overlay-list ul li.selected').removeClass("selected")
                            $(this).addClass("selected");
                            getSize(this)
                            getPos(this)
                            getzIndex($(this).attr('layer'));
                        })
                        
                        $('.overlay-close:last').click(function() {
                            if ($('#overlay-list > ul li > .overlay-close').length == 1)
                                $('#overlay-options').hide()
                            else {
                                if ($('li[layer='+(parseInt($(this).parent().attr('layer'))+1)+']').length > 0)
                                    var clicker = $('li[layer='+(parseInt($(this).parent().attr('layer'))+1)+']')
                                else if ($('li[layer='+(parseInt($(this).parent().attr('layer'))-1)+']').length > 0)
                                    var clicker = $('li[layer='+(parseInt($(this).parent().attr('layer'))-1)+']')
                            }
                            $('#overlay'+$(this).parent().attr('layer')).remove()
                            
                            $(this).parent().remove()
                            setTimeout(function(){clicker.click()},100);
                        })
                        
                        $('#overlay-lock').change(function() {
                            overlay = '#overlay'+$('#overlay-list ul li.selected').attr('layer')
                            if ($(this).attr('checked') == 'checked') {
                                $(overlay).attr({'locked':'true'})
                                $(overlay).draggable('disable')
                            }
                            else {
                                $(overlay).attr({'locked':null})
                                $(overlay).draggable('enable')
                            }
                        })
                        $('#overlay-options').show()
                        getzIndex($('#overlay-list ul li.selected').attr('layer'));
                    }
                }
            });
        },
    
        buildGlobalOptions: function() {
        
        }
    }
    
    function getPos(e) {
        if (e.offset) {
            $('#overlay-top').spinner('value',parseInt(e.offset.top))
            $('#overlay-left').spinner('value',parseInt(e.offset.left))
        }
        else if ($(e).css('top')) {
            var overlay = '#overlay'+$('#overlay-list ul li.selected').attr('layer')
            $('#overlay-top').spinner('value',parseInt($(overlay).css('top')))
            $('#overlay-left').spinner('value',parseInt($(overlay).css('left')))
        }
    }

    function getSize(e) {
        if (e.size) {
            $('#overlay-height').spinner('value',parseInt(e.size.height))
            $('#overlay-width').spinner('value',parseInt(e.size.width))
        }
        else if ($(e).css('height')) {
            var overlay = '#overlay'+$('#overlay-list ul li.selected').attr('layer')
            $('#overlay-height').spinner('value',parseInt($(overlay+' img').css('height')))
            $('#overlay-width').spinner('value',parseInt($(overlay+' img').css('width')))
        }
    }

    function getzIndex(i) {
        $('#overlay-zIndex').spinner('value',parseInt($('#overlay'+i).css('z-Index')))
    }

    function setPos() {
        var overlay = '#overlay'+$('#overlay-list ul li.selected').attr('layer')
        $(overlay).css({
            "left": $('#overlay-left').val()+'px',
            "top": $('#overlay-top').val()+'px'
        });
        /*
        $(overlay+' img').attr({
            "width": $('#overlay-width').val()+'px',
            "height": $('#overlay-height').val()+'px'
        });
        */
    }
    
    function setSize() {
        var overlay = '#overlay'+$('#overlay-list ul li.selected').attr('layer')
        $(overlay+', '+overlay+' img').attr({
            "width": $('#overlay-width').val()+'px',
            "height": $('#overlay-height').val()+'px'
        });
    }

    function setzIndex() {
        var overlay = '#overlay'+$('#overlay-list ul li.selected').attr('layer')
        var zindex = $('#overlay-zIndex').val()
        
        $('#overlay'+$(overlay).attr('layer')).css({"z-index": parseInt(zindex)})
    }
            

    /**
     * jQuery definition to anchor JsDoc comments.
     *
     * @see http://jQuery.com/
     * @name jQuery
     * @class jQuery Library
     */

    /**
     * Overlay Class
     *
     * @namespace Overlay
     * @memberOf jQuery
     * @param {object} el Element
     * @param {object} options Options
     * @param {object} modes Avalible modes
     * @return {jQuery} chainable jQuery class
     * @requires jQuery 1.7
     * @requires jScrollPane
     * @requires Mouse Wheel
     * @requires Mouse Wheel Intent
     */
    jQuery.overlay = function (el, options, modes) {
        options = jQuery.extend(jQuery.overlay.defaultOptions, options);
        $(document).ready(function() {
            jQuery('#webtools-toolbar')
                .append(jQuery(document.createElement('a'))
                    .attr({"id":"toolbar-overlay"})
                    .append(jQuery(document.createElement('span')).addClass("overlay smbtn")));
            methods.init(el, options, modes)
        });
    };

    /**
     * A jQuery Wrapper Function to append Overlay formatted text to a
     * DOM object converted to HTML.
     *
     * @namespace Overlay
     * @memberOf jQuery.fn
     * @param {method}
     * @return {jQuery} chainable jQuery class
     */
    $.fn.overlay = function(options) {
        return this.each(function () {
            (new $.overlay(this, options));
        });
    };

    /**
     * This Class breaks the chain, but returns the overlay if it has been
     * attached to the object.
     *
     * @namespace Get overlay
     * @memberOf jQuery.fn
     */
    jQuery.fn.getoverlay = function() {
        this.data("overlay");
    };
})(jQuery);

/* 
 * Select all images on page
 * $('img').filter('#overlay img')
 * select all background images
$('*').not('#webtools_topcontainer, #webtools_topcontainer *, #webtools_options, #webtools_options *, #overlay-menu, #overlay-menu *, .overlay-overlay, .overlay-overlay *').filter(function() {
    if (this.currentStyle) 
              return this.currentStyle['backgroundImage'] !== 'none';
    else if (window.getComputedStyle)
              return document.defaultView.getComputedStyle(this,null)
                                         .getPropertyValue('background-image') !== 'none';
})
 */