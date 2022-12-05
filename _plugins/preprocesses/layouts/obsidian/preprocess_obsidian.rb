require_relative './modules/preprocess_imagelink'
require_relative './modules/preprocess_wikilink'
require_relative './modules/preprocess_headings'
require_relative './modules/preprocess_callout'


module PreprocessObsidian
  include PreprocessImageLink
  include PreprocessWikiLink
  include PreprocessHeadings
  include PreprocessCallout
  def preprocess_obsidian(site, article)
    article.content = decouple_callout(article.content)
    article.content = convert_imagelink(article)
    article.content = convert_wikilink(site, article)
    article.content = convert_toc_formats(article.content)
    article
  end
end