require_relative './modules/preprocess_frontmatter'
module PreprocessCommon
  include PreprocessFrontmatter
  def preprocess_common(_site, post, changed)
    post.content = prevent_liquid(post.content) if post['use_Mathjax']
    if changed
      register_tags(post)
      post = register_categories(post)
    end
    post
  end
end

