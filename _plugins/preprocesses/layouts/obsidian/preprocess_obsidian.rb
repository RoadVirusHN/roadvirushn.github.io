require_relative './modules/preprocess_imagelink'
require_relative './modules/preprocess_wikilink'
require_relative './modules/preprocess_headings'
require_relative './modules/preprocess_callout'


module PreprocessObsidian
  include PreprocessImageLink
  include PreprocessWikiLink
  include PreprocessHeadings
  include PreprocessCallout
  def preprocess_obsidian(site, post)
    post.content = decouple_callout(post.content)
    post.content = convert_imagelink(post)
    post.content = convert_wikilink(site, post)
    post.content = convert_toc_formats(post.content)
    post
  end
end