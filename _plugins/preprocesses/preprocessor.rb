require_relative './layouts/obsidian/preprocess_obsidian'
require_relative './common/modules/preprocess_frontmatter'
require_relative './common/preprocess_common'
require_relative './tags/crude/preprocess_crude'

module Preprocessor
  class ArticleConverter < Jekyll::Generator
    safe true
    include PreprocessObsidian
    include PreprocessFrontmatter
    include PreprocessCommon
    include PreprocessCrude
    def generate(site)
      changed = register_posts(site.posts.docs)
      clear_categories if changed
      site.posts.docs.map do |doc|
        result = preprocess_common(site, doc, changed)
        result = preprocess_obsidian(site, result) if result['layout'].upcase == 'OBSIDIAN'
        result = preprocess_crude(site, result) if result['tags'].map(&:upcase).include?('CRUDE')
        result
      end
      create_category_pages(site).each do |page|
        site.pages << page
      end
    end
  end
end
