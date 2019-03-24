/* jshint -W104 */
hook.add("PFTCInit", "Resources", function() {
PFTC.resources = {

    TEMPLATE_PAGE_VIEW: PFTC.TEMPLATE_DIR + 'resources/pageview.html',

    render_page: function(obj, app, scope) {

        // Configure default scope
        scope = scope || {viewOnly: (app.attr("viewOnly") == "true"), preview : (app.attr("preview") == "true")};

        // Load HTML
	    var html = PFTC.loadTemplate(this.TEMPLATE_PAGE_VIEW);
        html = PFTC.populateTemplate(html, obj.data);
        return $(html);

    },
}

/* -------------------------------------------- */
/* Render Page Resource                         */
/* -------------------------------------------- */
// sync.render("ui_renderPage", function(obj, app, scope) {
//     return PFTC.resources.render_page(obj, app, scope);
// });

// End PFTC Init
});
