require_relative './obsidian/preprocesses/preprocess_imagelink'
require_relative './obsidian/preprocesses/preprocess_wikilink'
require_relative './obsidian/preprocesses/preprocess_headings'
require_relative './obsidian/preprocesses/preprocess_callout'
require_relative './post/preprocesses/preprocess_frontmatter'

module PostPreprocessor
  class PostConverter < Jekyll::Generator
    safe true

    def generate(site)
      site.posts.docs.map { |doc|
        preprocess_general(site, doc)
        if doc['layout'] == 'obsidian'
          preprocess_obsidian(site, doc)
        end
      }
    end
    include PreprocessFrontmatter
    def preprocess_general(_site, post)
      register_categories(post)
    end

    include PreprocessImageLink
    include PreprocessWikiLink
    include PreprocessHeadings
    include PreprocessCallout
    def preprocess_obsidian(site, post)
      post.content = decouple_callout(post.content)
      post.content = convert_image_link(post)
      post.content = convert_wikilink(site, post)
      post.content = convert_toc_formats(post.content)
      post
    end
  end
end
