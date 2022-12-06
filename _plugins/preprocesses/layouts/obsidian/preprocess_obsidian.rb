require_relative './modules/preprocess_imagelink'
require_relative './modules/preprocess_wikilink'
require_relative './modules/preprocess_headings'
require_relative './modules/preprocess_callout'
require_relative './modules/preprocess_codeblock'


module PreprocessObsidian
  include PreprocessImageLink
  include PreprocessWikiLink
  include PreprocessHeadings
  include PreprocessCallout
  include PreprocessCodeblock
  def preprocess_obsidian(site, article)
    article.content = decouple_callout(article.content)
    article.content = convert_imagelink(article)
    article.content = convert_wikilink(site, article)
    article.content = convert_toc_formats(article.content)
    article.content = convert_html_codeblock(article.content)
    article
  end
end