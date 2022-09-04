require_relative './obsidian/preprocesses/preprocess_imagelink'
require_relative './obsidian/preprocesses/preprocess_wikilink'
require_relative './obsidian/preprocesses/preprocess_headings'
require_relative './obsidian/preprocesses/preprocess_callout'

module ObsidianPreprocessor
  class ObsidianConverter < Jekyll::Generator
    safe true

    def generate(site)
      site.posts.docs.map { |doc|
        preprocess(site, doc) if doc['layout'] == 'obsidian'
      }
    end

    include PreprocessImageLink
    include PreprocessWikiLink
    include PreprocessHeadings
    include PreprocessCallout
    def preprocess(site, post)
      post.content = decouple_callout(post.content)
      post.content = convert_image_link(post)
      post.content = convert_wiki_link(site, post)
      post.content = convert_toc_formats(post.content)
      post
    end
  end
end
