(function () {
    var Shortcuts;

    Shortcuts = function (options) {
        this.cid = _.uniqueId("backbone.shortcuts");
        this.initialize.apply(this, arguments);
        return this.delegateShortcuts();
    };

    _.extend(Shortcuts.prototype, Backbone.Events, {
        initialize:function () {
        },
        delegateShortcuts:function () {
            var callback, match, method, scope, shortcut, shortcutKey, _ref, _results;
            if (!this.shortcuts) return;
            _ref = this.shortcuts;
            _results = [];
            for (shortcut in _ref) {
                callback = _ref[shortcut];
                if (!_.isFunction(callback)) {
                    method = this[callback];
                    if (!method) throw new Error("Method " + callback + " does not exist");
                }
                else {
                    method = callback;
                }
                match = shortcut.match(/^(.*?)\s*(<.*>)?$/);
                shortcutKey = match[1];
                var element = typeof match[2] === 'undefined' ? null : match[2].replace('>', '').replace('<', '');
                scope = 'all';
                method = _.bind(method, this);
                if (element) {
                    _results.push(
                        key(
                            shortcutKey,
                            scope,
                            method,
                            element,
                            function (e, localElement) {

                                if (localElement === 'all') {
                                    return true;
                                }

                                if (_.isUndefined($(localElement, this.$el).data('shortcutId'))) {
                                    $(localElement, this.$el).data('shortcutId', _.uniqueId('shortcut'))
                                }

                                return $(e.target).data('shortcutId') === $(localElement, this.$el).data('shortcutId');
                            }
                        )
                    );
                } else {
                    _results.push(
                        key(
                            shortcutKey,
                            scope,
                            method,
                            element,
                            function (e, localElement) {
                                var tagName = (e.target || e.srcElement).tagName;

                                return !(tagName == 'INPUT' || tagName == 'SELECT' || tagName == 'TEXTAREA');
                            }
                        )
                    );
                }
            }
            return _results;
        },
        undelegateShortcuts:function () {
            if (!this.shortcuts) return;
            var _ref, shortcut, match, shortcutKey, scope;
            _ref = this.shortcuts;

            for (shortcut in _ref) {
                match = shortcut.match(/^(.*?)\s*(<.*>)?$/);
                shortcutKey = match[1];
                var element = typeof match[2] === 'undefined' ? null : match[2].replace('>', '').replace('<', '');
                scope = 'all';

                shortcutKey = shortcutKey.replace(/\s/g, '');
                var keys = shortcutKey.split(',');
                for (i = 0; i < keys.length; i++) {
                    key.unbind(keys[i], scope, element);
                }
            }
        }
    });

    Backbone.Shortcuts = Shortcuts;

    Backbone.Shortcuts.extend = Backbone.View.extend;

}).call(this);
