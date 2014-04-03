/**
* @fileOverview News Specials Share Module - Share View
* Implements a shared view for Responsive/Desktop sites for a Personal Share module
* @requires bootstrap
* @requires Jquery-template-engine
* @requires share_template.inc/sssi
* @todo Add share options for other sharing environments and allow developer to select which ones will be available to the user i.e. Google+
* @author BBC / Steven Atherton 
* @version RC1
*/

/** @module nsshare-view */
define(['static/js/bootstrap'], function (news) {
    /**
    Takes a request from the DOM to share and select the correct social media    
    @function
    @param {object} - Event object
    @throws ValueError If the requesting object is not recognised
    */
    var requestShare = function (ev) {
        ev.preventDefault();
        ev.stopPropagation();

        news.pubsub.emitEvent('ns:share:call');
        if (news.$(ev.currentTarget).hasClass('share__tool--email')) {
            news.pubsub.emitEvent('ns:share:call:email');
        } else if (news.$(ev.currentTarget).hasClass('share__tool--facebook')) {
            news.pubsub.emitEvent('ns:share:call:facebook');
        } else if (news.$(ev.currentTarget).hasClass('share__tool--twitter')) {
            news.pubsub.emitEvent('ns:share:call:twitter');
        } else { throw new Error('ValueError: Share application not of know type i.e facebook'); }
    };
    /**
    * Represents the DOM view of the personalised share module
    * @constructor
    * @this {NSShareView}
    * @param {String} target - id of target element to embed sharetool module
    */
    var NSShareView = function (target) {
        // Instanstiate a new Template Engine
        // Attach the Template.tmpl prototype to the view

        this.sharemodule = news.$(target);
        this.viewReady = false;
        // Personal share request
        news.pubsub.addListener('ns:request:personalshare',
            news.$.proxy(this.buildShareModule, this));
        news.pubsub.addListener('ns:request:launchshare',
            news.$.proxy(function (target) {
                this.shareWindow(target, 'NSShareWindow', 500, 300, 'no');
            }, this)
        );
    };

    NSShareView.prototype.buildShareModule = function (model) {
        //this.sharemodule.on('click', '.share__tool', requestShare);
        $('.share__tool').click(requestShare);

        // inform controller
        this.viewReady = true;
        news.pubsub.emitEvent('ns:module:ready');

    };
    
    /**
    * Updates the Header element of the view
    * @public   
    * @method
    * @param {String} header - The Call to action, invitation to share text e.g. 'Share me'
    */
    NSShareView.prototype.updateHeader = function (header) {
        news.$('#ns_share_module .share__title').html(header);
    };
    /**
    * Launches the popup window for sharing
    * @public    
    * @method
    * @param {String} url - to the appropriate share API
    * @param {number} width - Width of the popup
    * @param {number} height - Height of the popup
    * @param {String} scroll - Allow scrollbar
    */
    NSShareView.prototype.shareWindow = function (url, winName, width, height, scroll) {
        var popupWindow, 
            leftPosition = (screen.width) ? (screen.width - width) / 2 : 0,
            topPosition = (screen.height) ? (screen.height - height) / 2 : 0,
            settings = 'height=' + height + 
            ',width=' + width + 
            ',top=' + topPosition + 
            ',left=' + leftPosition + 
            ',scrollbars=' + scroll + 
            ',resizable';
        popupWindow = window.open(url, winName, settings);
        // var left = (screen.width/2)-(width/2);
        // var top = (screen.height/2)-(height/2);
        // var popupWindow = window.open(url, winName, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width='+w+', height='+h+', top='+top+', left='+left);
    };

    return NSShareView;
        
});