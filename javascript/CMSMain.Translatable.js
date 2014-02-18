/**
 * File: CMSMain.Translatable.js
 */
(function($) {
	$.entwine('ss', function($){
	
		/**
		 * Class: .CMSMain #Form_LangForm
		 * 
		 * Dropdown with languages above CMS tree, causing a redirect upon translation
		 */
		$('.CMSMain #Form_LangForm').entwine({
			/**
			 * Constructor: onmatch
			 */
			onmatch: function() {
				var self = this;
			
				// monitor form loading for any locale changes
				$('#Form_EditForm').bind('loadnewpage', function(e) {
					var newLocale = $(this).find(':input[name=Locale]').val();
					if(newLocale) self.val(newLocale);
				});
			
				this._super();
			}
		});

		/**
		 * whenever a new value is selected, reload the whole CMS in the new locale
		 */
		$('.CMSMain #Form_LangForm :input[name=Locale]').entwine({
			onmatch: function() {
				// make sure this element is shown, since it might be hidden by chosen before the panel is cached
				$(this).show();
				this._super();
			},
			onchange: function(e) {
				// Get new locale code
				var locale = {locale: $(e.target).val()};
				var url = document.location.href;

                // Check existing url
                search = /locale=[^&]*/;
                if(url.match(search)) {
                    // Replace locale code
                    url = url.replace(search, $.param(locale));
                } else {
                    // Add locale code
                    url = $.path.addSearchParams(url, locale);
                }

                // Get id for translation and fix redirect url
                var selectedTreeItem = $('.cms-tree').jstree('get_selected');
                if(selectedTreeItem.length > 0) {
                    selectedTreeItem = selectedTreeItem.eq(0);
                    $.get(
                        $.path.addSearchParams(this.data('translationUrl'), {
                            'requestedLocale': $(e.target).val(),
                            'id': selectedTreeItem.data('id'),
                            'class': selectedTreeItem.data('pagetype')
                        }),
                        function(data) {
                            if(data != '') {
                                url = data;
                            }
                            $('.cms-container').loadPanel(url);
                        }
                    );
                    return false;
                }

				$('.cms-container').loadPanel(url);
				return false;
			}
		});
	
		/**
		 * Class: .CMSMain .createTranslation
		 * 
		 * Loads /admin/createtranslation, which will create the new record,
		 * and redirect to an edit form.
		 * 
		 * Dropdown in "Translation" tab in CMS forms, with button to 
		 * trigger translating the currently loaded record.
		 * 
		 * Requires:
		 *  jquery.metadata
		 */
		$('.LeftAndMain :input[name=action_createtranslation]').entwine({
			
			onclick: function(e) {
				this.parents('form').trigger('submit', [this]);
				e.preventDefault();
				return false;
			}
		});
	});
}(jQuery));