require_relative './obsidian/preprocesses/preprocess_imagelink'
require_relative './obsidian/preprocesses/preprocess_wikilink'
require_relative './obsidian/preprocesses/preprocess_headings'
require_relative './obsidian/preprocesses/preprocess_callout'
require_relative './post/preprocesses/preprocess_frontmatter'
require_relative './crude/preprocesses/preprocess_notice'

module PostPreprocessor
  class PostConverter < Jekyll::Generator
    safe true

    include PreprocessFrontmatter
    def generate(site)
      clear_categories
      register_posts(site.posts.docs)
      site.posts.docs.map do |doc|
        result = preprocess_general(site, doc)

        result = preprocess_obsidian(site, result) if result['layout'] == 'obsidian'
        result = preprocess_crude(site, result) if result['tags'].include?('crude') || result['tags'].include?('CRUDE')
        # result = preprocess_hide(site, result) if result['tags'].include?('hide') || result['tags'].include?('HIDE')
        result
      end
    end
    
    include PreprocessFrontmatter
    def preprocess_general(_site, post)
      register_tags(post)
      regsiter_categories(post)
    end

    include PreprocessNotice
    def preprocess_crude(_site, post)
      post.content = add_notice(post.content)
      post
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
