# Modify code from https://github.com/joshdavenport/jekyll-regex-replace (MIT license)
require 'liquid'
require_relative 'utils/customRegexFunc'

module Jekyll
  module RegexReplace
    def regex_replace(str, regex_search, value_replace)
      regex = /#{regex_search}/
      result = str.gsub(regex, value_replace)
      return result
    end

    def regex_replace_once(str, regex_search, value_replace)
      regex = /#{regex_search}/      
      return str.sub(regex, value_replace)
    end

    def regex_replace_wikilink(str, posts, page)
      str = regex_replace_obsidian_wikilink(str, posts, page)
      return str
      # return regex_replace_md_wikilink(str, posts, page)
    end
  end
end

Liquid::Template.register_filter(Jekyll::RegexReplace)
