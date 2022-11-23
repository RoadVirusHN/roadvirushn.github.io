# frozen_string_literal: true
require_relative './frontmatter/preprocess_tags'
require_relative './frontmatter/preprocess_categories'
require 'json'

module PreprocessFrontmatter
  def prevent_liquid(str)
    "{% raw %}\n#{str}\n{% endraw %}"
  end

  def register_posts(posts)
    posts_data = File.open('_data/json/posts.json').read
    data = JSON.parse(posts_data != '' ? posts_data : '{}')
    changed = update_posts_data(data, posts)
    if changed
      File.open('_data/json/posts.json', 'w') do |file|
        file.write(JSON.pretty_generate(data))
      end
    end
    changed
  end

  def update_posts_data(data, posts)
    changed = false
    posts.each do |post|
      new_data = build_post_info(post)
      post_id = post.url.encode('utf-8')
      if !data.key?(post_id) || data[post_id] != new_data
        data[post_id] = new_data
        changed = true
      end
    end
    changed
  end

  def build_post_info(post)
    post_data = post.data
    {
      'title' => post_data['title'].encode('utf-8'),
      'date' => post_data['date'].to_s.encode('utf-8'),
      'path' => post.path.encode('utf-8'),
      'tags' => post_data['tags'].map do |tag|
        tag.upcase.encode('utf-8')
      end
    }
  end
  include PreprocessTags
  include PreprocessCategories
end
