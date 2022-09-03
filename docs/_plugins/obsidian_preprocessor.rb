require_relative './obsidian/preprocesses/preprocess_imagelink'
require_relative './obsidian/preprocesses/preprocess_wikilink'
require_relative './obsidian/preprocesses/preprocess_headings'
require_relative './obsidian/preprocesses/preprocess_admonition'

module ObsidianPreprocessor
  class ObsidianConverter < Jekyll::Generator
    safe true

    def generate(site)
      for doc in site.posts.docs
        doc = preprocess(site, doc) if doc['layout'] == 'obsidian'
      end
    end

    include PreprocessImageLink
    include PreprocessWikiLink
    include PreprocessHeadings
    include PreprocessAdmonition
    def preprocess(site, post)
      post.content = decouple_admonition(post.content)
      post.content = convert_image_link(post)
      post.content = convert_wiki_link(site, post)
      post.content = convert_toc_formats(post.content)
      post
    end
  end
end
