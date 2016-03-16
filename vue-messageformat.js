(function () {

    function install(Vue) {
        /**
         * Translated an identifier using the messageformat compiled translation object.
         *
         * @param {string} identifier Translation identifier consists of path, file and key seperated by underscore _
         * @param {Object} options Translation options like gender or plural or simple replacements. Is optional.
         * @returns {string} Translation, or identifier in case of error (surrounded by ! means invalid identifier, ? means translation not found)
         */
        Vue.prototype.$i18n = function (identifier, options) {
            /* global i18n */
            // the global i18n has to contain compiled messageformat data
            if (typeof this.i18nLanguage === 'undefined') {
                console.error('Language must be defined. Make sure your instance provides this.i18nLanguage (i.e. = "en")')
                return identifier
            }

            if (!this.$i18nLanguageIsValid(this.i18nLanguage)) {
                console.error('Language "%s" is invalid.', this.i18nLanguage)
                return identifier
            }

            var parts = identifier.split('_')
            if (parts.length < 2) {
                console.error('Wrong identifier "%s"', identifier)
                console.error('Must be formatted: path_file_key')
                return '!' + identifier + '!'
            }

            // build path and key
            var path = parts.slice(0, -1).join('/')
            var key = parts[parts.length - 1]

            try {
                // try to get translation
                return i18n[this.i18nLanguage][path][key](options)
            } catch (e) {
                console.error('Translation for %s (%s) does not exist', identifier, this.i18nLanguage)
                // return the identifier as translation surrounded by question marks
                return '?' + identifier + '?'
            }
        }

        /**
         * Checks if given language is valid (=translations are present)
         *
         * @param {string} language
         * @returns {boolean}
         */
        Vue.prototype.$i18nLanguageIsValid = function (language) {
            /* global {[]} i18n */
            return i18n.indexOf(language) !== -1
        }
    }

    if (typeof exports == "object") {
        module.exports = install
    } else if (typeof define == "function" && define.amd) {
        define([], function () {
            return install
        })
    } else if (window.Vue) {
        Vue.use(install)
    }

})()