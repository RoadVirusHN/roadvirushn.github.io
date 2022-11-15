require_relative './preprocesses/preprocess_imagelink'
require_relative './preprocesses/preprocess_wikilink'
require_relative './preprocesses/preprocess_headings'
require_relative './preprocesses/preprocess_callout'


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