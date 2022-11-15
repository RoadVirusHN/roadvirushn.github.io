# frozen_string_literal: true
require 'json'

module PreprocessFrontmatter
  def prevent_liquid(str)
    "{% raw %}\n#{str}\n{% endraw %}"
  end

  def set_random_color
    r = rand(255)
    g = rand(255)
    b = rand(255)
    comp_r = 255 - r
    comp_g = 255 - g
    comp_b = 255 - b
    { 'background-color' => "rgb(#{r}, #{g}, #{g})", 'color' => "rgb(#{comp_r}, #{comp_g}, #{comp_b})" }
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

  def register_tags(post)
    tags = post.data['tags']
    tag_data = File.open('_data/json/tags.json').read
    data = JSON.parse(tag_data != '' ? tag_data : '{}')
    File.open('_data/json/tags.json', 'w') do |file|
      tags.each do |tag|
        next if data.key?(tag.upcase)

        data[tag.upcase] = set_random_color
      end

      file.write(JSON.pretty_generate(data))
    end
  end

  def clear_categories
    File.open('_data/json/categories.json', 'w') do |file|
      data = { 'categories' => {}, 'posts' => [] }
      file.write(JSON.pretty_generate(data))
    end
  end

  def register_categories(post)
    post.path.match(%r{_posts/(.+)/[^/]+\.(?:(?:md)|(?:markdown))}) do |_matched|
      categories = Regexp.last_match(1).split('/')
      post.data['categories'] = categories
      update_categories_json(categories, post)
    end
    post
  end
end

def update_categories_json(categories, post)
  data = JSON.parse(File.open('_data/json/categories.json').read)
  File.open('_data/json/categories.json', 'w') do |file|
    update_categories_data(data, categories, post)
    file.write(JSON.pretty_generate(data))
  end
end

def update_categories_data(data, categories, post)
  data_recursive = data
  categories.each_with_index do |category, index|
    category_upcase = category.upcase
    unless data_recursive['categories'].key?(category_upcase)
      data_recursive['categories'][category_upcase] = { 'categories' => {}, 'posts' => [] }
    end
    data_recursive = data_recursive['categories'][category_upcase]
    data_recursive['posts'].push(post.url) if index == categories.size - 1
  end
end
