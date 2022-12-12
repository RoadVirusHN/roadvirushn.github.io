require_relative './modules/preprocess_frontmatter'
module PreprocessCommon
  include PreprocessFrontmatter
  def preprocess_common(article, changed)
    article.content = prevent_liquid(article.content) if article['prevent_Liquid'] || article['use_Mathjax']
    if changed
      register_tags(article)
      article = register_categories(article)
    end
    article
  end
end

