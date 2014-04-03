var istatsGlobal;

require(['lib/istats', 'static/js/bootstrap', 'static/js/nsshare-model', 'static/js/nsshare-view'],
function (istats, news, NSShareModel, NSShareView) {

    'use strict';

    istatsGlobal = istats;
	window.istats = {
		enabled: true
	};
	window.bbcFlagpoles_istats = 'ON';
	window.istatsTrackingUrl = '//sa.bbc.co.uk/bbc/bbc/s?name=news.magazine.story.26793157&cps_asset_id=26793157&page_type=story';
	istats.init();
	istats.log(
		'pageView',
		'shorthand.initPageView',
		{
			'time':Date.now()
		}
	);

    var model, view;

var _callFaceBook = function () {
    news.pubsub.emitEvent('ns:request:launchshare', [model.fbShareTarget()]);
};

var _callTwitter = function () {
    news.pubsub.emitEvent('ns:request:launchshare', [model.twitterShareTarget()]);
};

var _callEmail = function () {
    news.pubsub.emitEvent('ns:request:launchshare', [model.emailShareTarget()]);
};

var _updateMessage = function (ev) {
    model.setShareMessage(ev);
};

var _initialiseModule = function () {
    news.pubsub.addListener('ns:share:message', function (target) { _updateMessage(target); });
    news.pubsub.addListener('ns:share:call:facebook', _callFaceBook);
    news.pubsub.addListener('ns:share:call:twitter', _callTwitter);
    news.pubsub.addListener('ns:share:call:email', _callEmail);
    news.pubsub.addListener('ns:update:header', function () {view.updateHeader(model.getHeader()); });
};

model = new NSShareModel({
    message: "A good man in Rwanda: “This is the story of the bravest man I’ve ever met”, via @BBCNewsMagazine",
    desc: "Shared via BBC News Magazine",
    image: "http://www.bbc.co.uk/news/special/2014/newsspec_6954/static/img/mbaye225.jpg"
});
model.storyPageUrl = "http://www.bbc.co.uk/news/magazine-26793157";
view = new NSShareView('#ns_share_module');
news.pubsub.addListener('ns:module:ready', _initialiseModule);
news.pubsub.emitEvent('ns:request:personalshare', [model]);

});