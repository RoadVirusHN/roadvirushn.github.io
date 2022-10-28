# frozen_string_literal: true

require 'json'

module PreprocessFrontmatter
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
    data = {}
    posts.each do |post|
      data[post.url.encode('utf-8')] = {
        "title" => post.data['title'].encode('utf-8'),
        "date" => post.data['date'],
        "path" => post.path.encode('utf-8'),
        "tags" => post.data['tags'].map do |tag|
          tag.upcase.encode('utf-8')
        end
      }
    end
    File.open('_data/json/posts.json', 'w') do |file|
      file.write(JSON.pretty_generate(data))
    end
  end

  def register_tags(post)
    tags = post.data['tags']
    data = JSON.parse(File.open('_data/json/tags.json').read)
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

  def regsiter_categories(post)
    post.path.match(%r{_posts/(.+)/[^/]+\.(?:(?:md)|(?:markdown))}) do |_matched|
      categories = Regexp.last_match(1).split('/')
      post.data['categories'] = categories
      data = JSON.parse(File.open('_data/json/categories.json').read)
      File.open('_data/json/categories.json', 'w') do |file|
        data_recursive = data
        categories.each_with_index do |category, index|
          category_upcase = category.upcase
          unless data_recursive['categories'].key?(category_upcase)
            data_recursive['categories'][category_upcase] = { 'categories' => {}, 'posts' => [] }
          end
          data_recursive = data_recursive['categories'][category_upcase]
          data_recursive['posts'].push(post.url) if index == categories.size - 1
        end

        file.write(JSON.pretty_generate(data))
      end
    end
    post
  end
end
