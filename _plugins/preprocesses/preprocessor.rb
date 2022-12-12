require_relative './layouts/obsidian/preprocess_obsidian'
require_relative './common/modules/preprocess_frontmatter'
require_relative './common/preprocess_common'

module Preprocessor
  class ArticleConverter < Jekyll::Generator
    safe true
    include PreprocessObsidian
    include PreprocessFrontmatter
    include PreprocessCommon
    def generate(site)
      changed = register_articles(site.collections['articles'])
      clear_categories if changed
      site.collections['articles'].docs.map do |article|
        result = preprocess_common(article, changed)
        result = preprocess_obsidian(site, result) if result['layout'].upcase == 'OBSIDIAN'
        result
      end
      create_category_pages(site).each do |page|
        site.pages << page
      end
    end
  end
end
